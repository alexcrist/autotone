#include <stdint.h>
#include <stdbool.h>

void reaper_init(float sample_rate, bool do_highpass, bool do_hilbert_transform);

void reaper_process(int16_t * input, int32_t input_length);

bool reaper_get_output_error();

int32_t reaper_get_output_length();

void reaper_get_output(float * times, float * freqs);

void reaper_cleanup();
