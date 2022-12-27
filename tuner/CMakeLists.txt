cmake_minimum_required(VERSION 3.24)
project(tuner)

include_directories(".")

# C API
add_library(tuner_api SHARED
  tuner.c
  tuner_utils.c
)