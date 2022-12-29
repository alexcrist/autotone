cmake_minimum_required(VERSION 3.24)
project(tuner)

include_directories(".")
include_directories("../reaper")
include_directories("../reaper/REAPER")

# Reaper compilation ===================================================

# Use C11 for unique_ptr
include(CheckCXXCompilerFlag)
CHECK_CXX_COMPILER_FLAG("-std=c++11" COMPILER_SUPPORTS_CXX11)
CHECK_CXX_COMPILER_FLAG("-std=c++0x" COMPILER_SUPPORTS_CXX0X)
if(COMPILER_SUPPORTS_CXX11)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
elseif(COMPILER_SUPPORTS_CXX0X)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++0x")
else()
  message(STATUS "The compiler ${CMAKE_CXX_COMPILER} has no C++11 support. Please use a different C++ compiler.")
endif()

# Core functionality
add_library(core STATIC
  ../reaper/REAPER/core/file_resource.cc
  ../reaper/REAPER/core/float_matrix.cc
  ../reaper/REAPER/core/track.cc
)

# Wave functionality
add_library(wave STATIC 
  ../reaper/REAPER/wave/codec_riff.cc
  ../reaper/REAPER/wave/wave.cc
  ../reaper/REAPER/wave/wave_io.cc
)

# Epoch tracker
add_library(epoch_tracker STATIC
  ../reaper/REAPER/epoch_tracker/fft.cc
  ../reaper/REAPER/epoch_tracker/fd_filter.cc
  ../reaper/REAPER/epoch_tracker/lpc_analyzer.cc
  ../reaper/REAPER/epoch_tracker/epoch_tracker.cc
)

# C API
add_library(reaper_c_api SHARED ../reaper/reaper_c_api.cc)

# Link it up
target_link_libraries(wave core)
target_link_libraries(epoch_tracker wave)
target_link_libraries(reaper_c_api epoch_tracker)

# Tuner compilation ====================================================

# C API
add_library(tuner_api SHARED
  tuner.c
  tuner_utils.c
)

# Link it up
target_link_libraries(tuner_api reaper_c_api)