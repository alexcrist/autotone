#include <stdint.h>
#include <stdlib.h>

void smb_pitch_shift(
  int32_t window_length,
  double shift_multiplier,
  double * freqs, 
  double * magns, 
  double * new_freqs, 
  double * new_magns
);