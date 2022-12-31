#include <stdint.h>

float * upsample_freqs(  
  float * old_array, 
  int32_t old_length, 
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

// TODO:
// * smoothing function (note: handle -1s appropriately)
//   * ask ChatGPT for Savitsky-Golay C implementation
// * write a function that pitch shifts given windows
// * update reassemble_windows to accept the output pointer (to prevent memory leaks)
// * maybe C program should have the window saved in memory? to avoid having to pass
//   it back and forth?
