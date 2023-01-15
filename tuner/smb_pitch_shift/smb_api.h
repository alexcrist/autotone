#include <stdint.h>

void smb_init(
  int32_t window_length,
  int32_t sample_rate,
  int32_t osamp
);

void smb_process_window(
  int16_t * buffer, 
  double shift_multiplier
);

void smb_cleanup();