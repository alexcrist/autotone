cmake_minimum_required(VERSION 3.24)
project(smb_pitch_shifter)

include_directories(".")

# Add fftw3 library
find_package(PkgConfig REQUIRED)
pkg_search_module(FFTW REQUIRED fftw3 IMPORTED_TARGET)
include_directories(PkgConfig::FFTW)
link_libraries(PkgConfig::FFTW)

# C API
add_library(smb_api SHARED 
  smb_api.c
  dsp.c
  fft_smb.c
)


