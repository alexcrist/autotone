cmake_minimum_required(VERSION 3.24)
project(Reaper)

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

include_directories("REAPER/")

# Core functionality
add_library(core STATIC
  REAPER/core/file_resource.cc
  REAPER/core/float_matrix.cc
  REAPER/core/track.cc
)

# Wave functionality
add_library(wave STATIC 
  REAPER/wave/codec_riff.cc
  REAPER/wave/wave.cc
  REAPER/wave/wave_io.cc
)

# Epoch tracker
add_library(epoch_tracker STATIC
  REAPER/epoch_tracker/fft.cc
  REAPER/epoch_tracker/fd_filter.cc
  REAPER/epoch_tracker/lpc_analyzer.cc
  REAPER/epoch_tracker/epoch_tracker.cc
)

# Binary to extract F0
add_executable(reaper REAPER/epoch_tracker_main.cc)

# C API
add_library(reaper_c_api SHARED reaper_c_api.cc)

# Link it up
target_link_libraries(wave core)
target_link_libraries(epoch_tracker wave)
target_link_libraries(reaper epoch_tracker)
target_link_libraries(reaper_c_api epoch_tracker)
