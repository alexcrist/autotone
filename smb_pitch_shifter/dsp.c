#include <stdint.h>
#include <stdlib.h>
#include <math.h>

void smb_pitch_shift(
  int32_t window_length,
  double shift_multiplier,
  double * freqs, 
  double * magns, 
  double * new_freqs, 
  double * new_magns
) {
  for (int32_t i = 0; i < window_length / 2 + 1; i++) {
    int32_t index = (int32_t) round((double) i * shift_multiplier);
    if (index < window_length / 2 + 1) {
      new_freqs[index] = freqs[i] * shift_multiplier;
      new_magns[index] += magns[i];
    }
  }
}