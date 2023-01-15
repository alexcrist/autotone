#include <math.h>
#include <stdint.h>
#include <stdlib.h>

void upsample_linear(
  float * old_array, 
  int32_t old_length, 
  float * new_array,
  int32_t new_length
) {
  for (int32_t i = 0; i < new_length; i++) {
    float fractional_index = (float) i / (float) (new_length - 1) * (float) (old_length - 1);
    float lower = old_array[(int32_t) floor(fractional_index)];
    float upper = old_array[(int32_t) ceil(fractional_index)];
    float slope = upper - lower;
    float dX = fractional_index - floor(fractional_index);
    new_array[i] = lower + (slope * dX);
  }
}

void downsample_box(
  float * old_array, 
  int32_t old_length, 
  float * new_array,
  int32_t new_length
) {
  float ratio = (float) old_length / (float) new_length;
  for (int32_t i = 0; i < new_length; i++) {
    float sum = 0;
    for (int32_t j = 0; j < ratio; j++) {
      int32_t index = (int32_t) (i * ratio) + j;
      sum += old_array[index];
    }
    new_array[i] = sum / ratio;
  }
}

int32_t get_num_windows(
  int32_t audio_size,
  int32_t window_size,
  int32_t osamp
) {
  int32_t hop_size = window_size / osamp;
  return audio_size / hop_size - osamp - 1;
}

int16_t ** create_windows(
  int16_t * audio,
  int32_t audio_size,
  int32_t window_size,
  int32_t osamp
) {
  int32_t num_windows = get_num_windows(audio_size, window_size, osamp);
  int16_t ** windows = calloc(num_windows, sizeof(int16_t *));
  int32_t hop_size = window_size / osamp;
  for (int32_t i = 0; i < num_windows; i++) {
    int16_t * window = calloc(window_size, sizeof(int16_t));
    for (int32_t j = 0; j < window_size; j++) {
      double hanning = 0.5 * (1.0 - cos(2.0 * M_PI * (double) j / ((double) window_size - 1.0)));
      int32_t index = i * hop_size + j;
      window[j] = (int16_t) ((double) audio[index] * hanning);
    }
    windows[i] = window;
  }
  return windows;
}

void free_windows(int16_t ** windows, int32_t num_windows) {
  for (int32_t i = 0; i < num_windows; i++) {
    free(windows[i]);
  }
  free(windows);
}

int32_t get_reassembled_audio_size(
  int32_t num_windows,
  int32_t window_size,
  int32_t osamp
) {
  int32_t hop_size = window_size / osamp;
  return num_windows * hop_size + window_size;
}

int16_t * reassemble_windows(
  int16_t ** windows,
  int32_t num_windows,
  int32_t window_size,
  int32_t osamp
) {
  int32_t hop_size = window_size / osamp;
  int32_t audio_size = get_reassembled_audio_size(num_windows, window_size, osamp);
  int16_t * audio = calloc(audio_size, sizeof(int16_t));
  for (int32_t i = 0; i < num_windows; i++) {
    for (int32_t j = 0; j < window_size; j++) {
      int32_t index = i * hop_size + j;
      audio[index] += windows[i][j];
    }
  }
  return audio;
}