cmake_minimum_required(VERSION 3.24)
project(smb_pitch_shifter)

include_directories(".")

add_library(smb_api SHARED 
  smb_api.c
  dsp.c
  fft_smb.c
  kiss_fft/kiss_fft.c
  kiss_fft/kiss_fftr.c
)
