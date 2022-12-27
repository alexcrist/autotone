import os
import numpy as np
from scipy.io import wavfile
from ctypes import CDLL, POINTER, cast, c_double, c_float, c_bool, c_int16, c_int32

current_dir = os.path.dirname(os.path.realpath(os.path.abspath('')))

# Load audio ==================================================================

def load_audio(path):
    audio_path = os.path.normpath(current_dir + path)
    return wavfile.read(audio_path)

# Reaper pitch detection library ==============================================

shared_file = os.path.normpath(current_dir + '/reaper/build/libreaper_c_api.dylib')
reaper = CDLL(shared_file)
reaper.init.argtypes = [c_float, c_bool, c_bool]
reaper.process.argtypes = [POINTER(c_int16), c_int32]
reaper.get_output_error.restype = c_bool
reaper.get_output_length.restype = c_int32
reaper.get_output.argtypes = [POINTER(c_float), POINTER(c_float)]

def reaper_init(sample_rate, do_highpass, do_hilbert):
    reaper.init(sample_rate, do_highpass, do_hilbert)
    
def reaper_process(audio):
    reaper.process((c_int16 * len(audio))(*audio), len(audio))
    if reaper.get_output_error():
        print('Error occurred.')
    output_length = reaper.get_output_length()
    output_times = (c_float * output_length)()
    output_freqs = (c_float * output_length)()
    reaper.get_output(output_times, output_freqs)
    output_times = np.frombuffer(output_times, c_float)
    output_freqs = np.frombuffer(output_freqs, c_float)
    return output_freqs

# SMB pitch shifting library ==================================================

shared_file = os.path.normpath(current_dir + '/smb_pitch_shifter/build/libsmb_api.dylib')
smb = CDLL(shared_file)
smb.init.argtypes = [c_int32, c_int32, c_int32]
smb.process_window.argtypes = [POINTER(c_int16), c_double]

def smb_init(window_length, sample_rate, osamp):
    smb.init(window_length, sample_rate, osamp)
    
def smb_process_window(window, shift_multiplier):
    window = window.astype(np.int16).tolist()
    new_window = (c_int16 * len(window))(*window)
    smb.process_window(new_window, shift_multiplier)
    return new_window

# Tuner library ===============================================================

shared_file = os.path.normpath(current_dir + '/tuner/build/libtuner_api.dylib')
tuner = CDLL(shared_file)
tuner.upsample_linear.argtypes = [POINTER(c_double), c_int32, c_int32]
tuner.upsample_linear.restype = POINTER(c_double)

def tuner_upsample_linear(array, new_length):
    output_pointer = tuner.upsample_linear(
        (c_double * len(array))(*array),
        len(array),
        new_length
    )
    output_array = np.empty((new_length), dtype=np.double)
    for i in range(new_length):
        output_array[i] = output_pointer[i]
    return output_array
    
    