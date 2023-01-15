/*
  Credit to http://blogs.zynaptiq.com/bernsee for the algorithm used in this
  file which tracks Fourier transform phase information between audio buffers
  to produce accurate real-time spectral analysis

  One thing to note about this FFT code is that it should only be used for
  real-time FFT applications where consecutive windows of audio are being
  processed.

  The reason for this is because this code is state-ful and will store phase
  information about each Fourier transformation that will affect the future
  transformations.

  One other note, "smb" = Stephan M. Bernsee (the guy credited above).
*/

#include <math.h>
#include <stdlib.h>
#include <complex.h>
#include <string.h>
#include "../kiss_fft/kiss_fftr.h"

static double * freqs;
static double * magns;
static double ** freqs_magns;
static double * output;

static int32_t step_length;
static double freq_per_bin;
static double expct;

static double * prev_phase;
static double ** sum_phases; 

static int32_t window_length;
static int32_t osamp;
static int32_t sample_rate;
static int32_t n_output_channels;

static kiss_fftr_cfg fft_config;
static kiss_fftr_cfg ifft_config;
static kiss_fft_scalar * fft_reals;
static kiss_fft_cpx * fft_complexes;

static double real, imag, magn, phase, tmp, amp_min, amp_max, new_amp_min, 
              new_amp_max;

// Initialize FFT ==============================================================

void init_fft_smb(
  int32_t _window_length,
  int32_t _osamp,
  int32_t _sample_rate,
  int32_t _n_output_channels
) {
  window_length = _window_length;
  osamp = _osamp;
  sample_rate = _sample_rate;
  n_output_channels = _n_output_channels;

  step_length = window_length / osamp;
  freq_per_bin = (double) sample_rate / (double) window_length;
  expct = 2.0 * M_PI * (double) step_length / (double) window_length;

  freqs = calloc(window_length, sizeof(double));
  magns = calloc(window_length, sizeof(double));
  output = calloc(window_length, sizeof(double));
  freqs_magns = calloc(2, sizeof(double *));
  freqs_magns[0] = freqs;
  freqs_magns[1] = magns;

  prev_phase = calloc(window_length / 2 + 1, sizeof(double));
  sum_phases = calloc(n_output_channels, sizeof(double *));
  for (int32_t i = 0; i < n_output_channels; i++) {
    sum_phases[i] = calloc(window_length / 2 + 1, sizeof(double));
  }

  fft_reals = calloc(window_length, sizeof(kiss_fft_scalar));
  fft_complexes = calloc((window_length / 2 + 1), sizeof(kiss_fft_cpx));

  fft_config = kiss_fftr_alloc(window_length, 0, NULL, NULL);
  ifft_config = kiss_fftr_alloc(window_length, 1, NULL, NULL);
}

// Execute the FFT =============================================================

// Runs the FFT on a window of audio (amplutide must be in [-1, 1))
// Returns an array of two arrays, the first containing the frequencies
// and the second containing the magnitudes of the FFT.
//
// Note: This operation is stateful and will store phase information that will 
//       affect future calls to this function
double ** fft_smb(double * window) {

  // Window and convert audio to mono
  amp_min = 1.0;
  amp_max = -1.0;
  for (int32_t i = 0; i < window_length; i++) {
    double mono = (window[i * 2] + window[i * 2 + 1]) / 2.0;
    if (mono < amp_min) amp_min = mono;
    if (mono > amp_max) amp_max = mono;
    double window_constant = 0.5 * (1.0 - cos(2.0 * M_PI * (double) i / ((double) window_length - 1.0)));
    fft_reals[i] = mono * window_constant;
  }

  // Run fft
  kiss_fftr(fft_config, fft_reals, fft_complexes);

  // Use phase information to analyze true frequencies
  for (int32_t i = 0; i < window_length / 2 + 1; i++) {

    // Compute magnitude and phase
    real = fft_complexes[i].r;
    imag = fft_complexes[i].i;
    magn = 2.0 * sqrt(real * real + imag * imag);
    phase = atan2(imag, real);

    // Compute phase difference
    tmp = phase - prev_phase[i];
    prev_phase[i] = phase;

    // Subtract expected phase difference
    tmp -= (double) i * expct;

    // Map delta phase into +/- Pi interval
    int32_t qpd = (int32_t) (tmp / M_PI);
    if (qpd >= 0) {
      qpd += qpd&1;
    } else {
      qpd -= qpd&1;
    }
    tmp -= M_PI * (double) qpd;

    // Get deviation from bin frequency
    tmp = (double) osamp * tmp / (2.0 * M_PI);

    // Compute the i-th partials' true frequency
    tmp = (double) i * freq_per_bin + tmp * freq_per_bin;

    // Store the magnitude and true frequency
    magns[i] = magn;
    freqs[i] = tmp;
  }

  return freqs_magns;
}

// Execute the inverse FFT =====================================================

// Runs the iFFT on two arrays that represent the frequencies and magniutdes of
// the Fourier transofrm to be inversed to a window of audio.
//
// Note: This operation is stateful and will store phase information that will
//       affect future calls to this function (on a per output_channel basis)
double * ifft_smb(double * new_freqs, double * new_magns, int32_t output_channel) {

  // Synthesize FFT complex values from freqs, magns, and stored phase data
  for (int32_t i = 0; i < window_length / 2 + 1; i++) {
    
    // Get new frequency and magnitude
    tmp = new_freqs[i];
    magn = new_magns[i];

    // Subtract bin mid frequency
    tmp -= (double) i * freq_per_bin;

    // Get bin deviation from frequency deviation
    tmp /= freq_per_bin;

    // Take osamp into account
    tmp = 2.0 * M_PI * tmp / (double) osamp;

    // Add the overlap phase advance back in
    tmp += (double) i * expct;

    // Accumulate delta phase to get bin phase
    sum_phases[output_channel][i] += tmp;
    phase = sum_phases[output_channel][i];

    // Get real and imaginary parts
    real = magn * cos(phase);
    imag = magn * sin(phase);
    fft_complexes[i].r = real;
    fft_complexes[i].i = imag;
  }

  // Run inverse fft
  kiss_fftri(ifft_config, fft_complexes, fft_reals);

  // Determine new min/max amplitude
  new_amp_min = fft_reals[0];
  new_amp_max = fft_reals[0];
  for (int32_t i = 0; i < window_length; i++) {
    if (fft_reals[i] < new_amp_min) new_amp_min = fft_reals[i];
    if (fft_reals[i] > new_amp_max) new_amp_max = fft_reals[i];
  }

  // Scale, window, and output audio
  for (int32_t i = 0; i < window_length; i++) {

    // Scale audio to input range
    if (new_amp_max - new_amp_min == 0.0) {
      fft_reals[i] = fft_reals[i];
    } else {
      fft_reals[i] = (fft_reals[i] - new_amp_min) / (new_amp_max - new_amp_min) * (amp_max - amp_min) + amp_min;
    }

    // Account for window overlap
    fft_reals[i] *= 2.0 / (double) osamp;

    // Apply window
    fft_reals[i] *= 0.5 * (1.0 - cos(2.0 * M_PI * (double) i / ((double) window_length - 1.0)));

    // Output audio
    output[i] = fft_reals[i];
  }

  return output;
}

// Clean up ============================================================

void cleanup_fft_smb() {
  free(freqs);
  free(magns);
  free(output);
  free(freqs_magns);
  free(prev_phase);
  for (int32_t i = 0; i < n_output_channels; i++) {
    free(sum_phases[i]);
  }
  free(sum_phases);
  free(fft_reals);
  free(fft_complexes);
  kiss_fftr_free(fft_config);
  kiss_fftr_free(ifft_config);
}