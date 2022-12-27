#include <math.h>
#include <stdint.h>
#include <stdlib.h>

double * upsample_linear(
  double * old_array, 
  int32_t old_length, 
  int32_t new_length
) {
  double * new_array = calloc(sizeof(double), new_length);
  for (int32_t i = 0; i < new_length; i++) {
    double fractional_index = (double) i / (double) (new_length - 1) * (double) (old_length - 1);
    int32_t lower = old_array[(int32_t) floor(fractional_index)];
    int32_t upper = old_array[(int32_t) ceil(fractional_index)];
    double slope = upper - lower;
    double dX = fractional_index - floor(fractional_index);
    new_array[i] = lower + (slope * dX);
  }
  return new_array;
}