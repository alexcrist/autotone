cmake_minimum_required(VERSION 3.24)
project(tuner)

include_directories(".")
include_directories("../smb_pitch_shifter")

add_library(smb_api SHARED 
  ../smb_pitch_shifter/smb_api.c
  ../smb_pitch_shifter/dsp.c
  ../smb_pitch_shifter/fft_smb.c
  ../smb_pitch_shifter/kiss_fft/kiss_fft.c
  ../smb_pitch_shifter/kiss_fft/kiss_fftr.c
)

add_library(tuner_api SHARED
  tuner_api.c
  tuner_utils.c
)

target_link_libraries(tuner_api smb_api)
