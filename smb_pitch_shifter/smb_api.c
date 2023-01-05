#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include "fft_smb.h"
#include "dsp.h"

#define NUM_OUTPUT_CHANNELS 1
#define OUTPUT_CHANNEL 0
#define MAX_INT_16 32768

static int32_t window_length_;

static double * window;
static double * new_freqs;
static double * new_magns;
static double * output;

void smb_init(
  int32_t window_length,
  int32_t sample_rate,
  int32_t osamp
) {
  window_length_ = window_length;
  init_fft_smb(window_length, osamp, sample_rate, NUM_OUTPUT_CHANNELS);
  window = calloc(window_length * 2, sizeof(double));
  new_freqs = calloc(window_length, sizeof(double));
  new_magns = calloc(window_length, sizeof(double));
}

// Pitch shifts a (mono) window of audio
void smb_process_window(
  int16_t * buffer,
  double shift_multiplier
) {

  // Scale window to [-1, 1) range and convert mono to stereo
  for (int32_t i = 0; i < window_length_; i++) {
    window[2 * i] = (double) buffer[i] / MAX_INT_16; 
    window[2 * i + 1] = (double) buffer[i] / MAX_INT_16;
  }

  // Run FFT
  double ** freqs_magns = fft_smb(window);
  double * freqs = freqs_magns[0];
  double * magns = freqs_magns[1];

  // Pitch shift
  memset(new_freqs, 0, window_length_ * sizeof(double));
  memset(new_magns, 0, window_length_ * sizeof(double));
  smb_pitch_shift(window_length_, shift_multiplier, freqs, magns, new_freqs, new_magns);

  // Run iFFT
  output = ifft_smb(new_freqs, new_magns, OUTPUT_CHANNEL);

  // Load audio into buffer
  for (int32_t i = 0; i < window_length_; i++) {
    buffer[i] = output[i] * MAX_INT_16;
  }
}

void smb_cleanup() {
  free(window);
  free(new_freqs);
  free(new_magns);
  cleanup_fft_smb();
}