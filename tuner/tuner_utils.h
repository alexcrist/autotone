#include <stdint.h>

void upsample_linear(
  float * old_array, 
  int32_t old_length, 
  float * new_array,
  int32_t new_length
);

void downsample_box(
  float * old_array, 
  int32_t old_length, 
  float * new_array,
  int32_t new_length
);

int32_t get_num_windows(
  int32_t audio_size,
  int32_t window_size,
  int32_t osamp
);

int16_t ** create_windows(
  int16_t * audio,
  int32_t audio_size,
  int32_t window_size,
  int32_t osamp
);

void free_windows(
  int16_t ** windows, 
  int32_t num_windows
);

int32_t get_reassembled_audio_size(
  int32_t num_windows,
  int32_t window_size,
  int32_t osamp
);

int16_t * reassemble_windows(
  int16_t ** windows,
  int32_t num_windows,
  int32_t window_size,
  int32_t osamp
);
