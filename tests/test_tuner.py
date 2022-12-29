import os
import numpy as np
import pandas as pd
from scipy.io import wavfile
from ctypes import CDLL, POINTER, c_float, c_bool, c_int16, c_int32

WINDOW_SIZE = 512
OSAMP = 64
DO_HIGHPASS = True
DO_HILBERT_TRANSFORM = True

current_dir = os.path.dirname(os.path.realpath(os.path.abspath('')))

print(current_dir)

shared_file = os.path.normpath(current_dir + '/voice/tuner/build/libtuner_api.dylib')
tuner = CDLL(shared_file)
tuner.pitch_detect.argtypes = [
  POINTER(c_int16),
  c_int32,
  c_float,
  c_int32,
  c_int32,
  c_bool,
  c_bool,
  POINTER(c_float),
]
tuner.get_num_pitches.argtypes = [
  c_int32,
  c_int32,
  c_int32,
]
tuner.get_num_pitches.restype = c_int32

print('Loading audio...')

audio_path = os.path.normpath(current_dir + '/voice/audio/humming_short.wav')
sample_rate, audio = wavfile.read(audio_path)

print('Detecting pitches...\n')

audio_pointer = (c_int16 * len(audio))(*audio)
num_pitches = tuner.get_num_pitches(len(audio), WINDOW_SIZE, OSAMP)
output = (c_float * num_pitches)()

tuner.pitch_detect(
  audio_pointer,
  len(audio),
  sample_rate,
  WINDOW_SIZE,
  OSAMP,
  DO_HIGHPASS,
  DO_HILBERT_TRANSFORM,
  output
)

output = np.frombuffer(output, dtype=np.float32)
print('\nSummary of frequency data:', pd.DataFrame(output).describe())

print('\nDone.')