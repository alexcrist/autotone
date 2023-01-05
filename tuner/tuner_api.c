#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <float.h>
#include <math.h>
#include <stdio.h>
#include "tuner_utils.h"
#include "reaper_api.h"
#include "smb_api.h"

// Detects the pitches in an audio wave
void pitch_detect(
  int16_t * audio,
  int32_t audio_size,
  float sample_rate,
  int32_t window_size,
  int32_t osamp,
  bool do_highpass,
  bool do_hilbert_transform,
  float * output_freqs
) {

  // Pitch detect
  reaper_init(sample_rate, do_highpass, do_hilbert_transform);
  reaper_process(audio, audio_size);
  int32_t output_size = reaper_get_output_length();
  float * times = calloc(output_size, sizeof(float));
  float * freqs = calloc(output_size, sizeof(float));
  reaper_get_output(times, freqs);
  reaper_cleanup();

  // Upsample
  int32_t num_windows = get_num_windows(audio_size, window_size, osamp);
  float * upsampled_freqs = upsample_freqs(freqs, output_size, num_windows);
  memcpy(output_freqs, upsampled_freqs, num_windows * sizeof(float));
  
  // Free
  free(times);
  free(freqs);
  free(upsampled_freqs);
}

int32_t get_num_pitches(
  int32_t audio_size,
  int32_t window_size,
  int32_t osamp
) {
  return get_num_windows(audio_size, window_size, osamp);
}

// Corrects the given frequencies by snapping them to the nearest
// frequency in the given scale. The scale must be sorted from lowest
// to highest frequency
void pitch_snap(
  float * freqs, 
  int32_t freqs_size,
  float * scale, 
  int32_t scale_size,
  float * output_freqs
) {
  for (int32_t i = 0; i < freqs_size; i++) {
    float freq = freqs[i];
    if (freq <= 0) {
      output_freqs[i] = freq;
      continue;
    }
    float closest_freq = 0;
    float closest_dist = FLT_MAX;
    for (int32_t j = 0; j < scale_size; j++) {
      float scale_freq = scale[j];
      float dist = fabs(log(freq) - log(scale_freq));
      if (dist < closest_dist) {
        closest_dist = dist;
        closest_freq = scale_freq;
      }
    }
    output_freqs[i] = closest_freq;
  }
}

// Pitch shifts the audio to the given frequencies
void pitch_shift(
  int16_t * audio,
  int32_t audio_size,
  int32_t window_size,
  int32_t sample_rate,
  int32_t osamp,
  float * original_freqs,
  int32_t original_freqs_size,
  float * target_freqs,
  int32_t target_freqs_size,
  int32_t target_freqs_offset,
  int16_t * output_audio
) {
  int16_t ** windows = create_windows(audio, audio_size, window_size, osamp);
  int32_t num_windows = get_num_windows(audio_size, window_size, osamp);
  smb_init(window_size, sample_rate, osamp);
  for (int32_t i = 0; i < num_windows; i++) {
    double shift_multiplier = 1;
    if (
      i < original_freqs_size &&
      i + target_freqs_offset < target_freqs_size &&
      original_freqs[i] > 0 &&
      target_freqs[i + target_freqs_offset] > 0
    ) {
      shift_multiplier = (double) target_freqs[i + target_freqs_offset] / (double) original_freqs[i];
    }
    smb_process_window(windows[i], shift_multiplier);
  }
  int16_t * reassembled_audio = reassemble_windows(windows, num_windows, window_size, osamp);
  int32_t reassembled_audio_size = get_reassembled_audio_size(num_windows, window_size, osamp);
  memcpy(output_audio, reassembled_audio, reassembled_audio_size * sizeof(int16_t));
  free_windows(windows, num_windows);
  free(reassembled_audio);
  smb_cleanup();
}

// Smoothes the given frequency array. Values of -1 will not be smoothed
void smooth(
  float * freqs,
  int32_t freqs_size,
  int32_t smoothing_window_size,
  float * output_freqs
) {
  for (int32_t i = 0; i < freqs_size; i++) {
    if (freqs[i] == -1) {
      output_freqs[i] = -1;
      continue;
    }
    float sum = freqs[i];
    int32_t qty = 1;
    for (int32_t j = 1; j < smoothing_window_size / 2; j++) {
      int32_t index = i - j;
      if (index < 0) {
        break;
      }
      if (freqs[index] == -1) {
        break;
      }
      sum += freqs[index];
      qty++;
    }
    for (int32_t j = 1; j < smoothing_window_size / 2; j++) {
      int32_t index = i + j;
      if (index >= freqs_size) {
        break;
      }
      if (freqs[index] == -1) {
        break;
      }
      sum += freqs[index];
      qty++;
    }
    output_freqs[i] = sum / (float) qty;
  }
}