#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include "tuner_utils.h"
#include "reaper_c_api.h"

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
// frequency in the given scale
void pitch_correct(
  float * freqs, 
  float * scale, 
  float * output_freqs
) {

}

// Pitch shifts the audio to the given frequencies
void pitch_shift(
  int16_t * audio, 
  int32_t audio_size,
  float * freqs,
  int32_t freqs_size,
  int32_t freqs_offset,
  int16_t * output_audio
) {

}

// Smoothes the given frequency array. Values of -1 will not be smoothed
void smooth(
  float * freqs,
  int32_t smoothing_window_size
) {

}