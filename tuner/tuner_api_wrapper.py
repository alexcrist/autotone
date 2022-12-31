import os
from pathlib import Path
import numpy as np
from ctypes import CDLL, POINTER, c_float, c_bool, c_int16, c_int32

shared_file = str(Path(os.path.dirname(__file__), 'build/libtuner_api.dylib').resolve())
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
tuner.pitch_snap.argtypes = [
  POINTER(c_float),
  c_int32,
  POINTER(c_float),
  c_int32,
  POINTER(c_float),
]
tuner.pitch_shift.argtypes = [
  POINTER(c_int16),
  c_int32,
  c_int32,
  c_int32,
  c_int32,
  POINTER(c_float),
  c_int32,
  POINTER(c_float),
  c_int32,
  c_int32,
  POINTER(c_int16),
]

def tuner_pitch_detect(audio, sample_rate, window_size, osamp, do_highpass, do_hilbert_transform):
  audio_pointer = (c_int16 * len(audio))(*audio)
  num_pitches = tuner.get_num_pitches(len(audio), window_size, osamp)
  detected_freqs = (c_float * num_pitches)()
  tuner.pitch_detect(
    audio_pointer,
    len(audio),
    sample_rate,
    window_size,
    osamp,
    do_highpass,
    do_hilbert_transform,
    detected_freqs
  )
  return np.frombuffer(detected_freqs, dtype=np.float32)
  
def tuner_pitch_snap(freqs, scale):
  freqs_pointer = (c_float * len(freqs))(*freqs)
  scale_pointer = (c_float * len(scale))(*scale)
  snapped_freqs = (c_float * len(freqs))()
  tuner.pitch_snap(
    freqs_pointer,
    len(freqs),
    scale_pointer,
    len(scale),
    snapped_freqs,
  )
  return np.frombuffer(snapped_freqs, dtype=np.float32)

def tuner_pitch_shift(
  audio,
  sample_rate,
  window_size,
  osamp,
  original_freqs,
  target_freqs,
  target_freqs_offset=0
):
  audio_pointer = (c_int16 * len(audio))(*audio)
  original_freqs_pointer = (c_float * len(original_freqs))(*original_freqs)
  target_freqs_pointer = (c_float * len(target_freqs))(*target_freqs)
  shifted_audio = (c_int16 * len(audio))()
  tuner.pitch_shift(
    audio_pointer,
    len(audio),
    window_size,
    sample_rate,
    osamp,
    original_freqs_pointer,
    len(original_freqs),
    target_freqs_pointer,
    len(target_freqs),
    target_freqs_offset,
    shifted_audio
  )
  return np.frombuffer(shifted_audio, dtype=np.int16)