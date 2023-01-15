#include <stdint.h>
#include <stdlib.h>

void init_fft_smb(
  int32_t _window_length,
  int32_t _osamp,
  int32_t _sample_rate,
  int32_t _n_output_channels
);

double ** fft_smb(double * window);

double * ifft_smb(double * new_freqs, double * new_magns, int32_t output_channel);

void cleanup_fft_smb();