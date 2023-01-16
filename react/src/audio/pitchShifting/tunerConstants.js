// Web worker message types

export const TUNER_INIT = 'TUNER_INIT';
export const TUNER_GET_NUM_WINDOWS = 'TUNER_GET_NUM_WINDOWS';
export const TUNER_RESAMPLE_LINEAR = 'TUNER_RESAMPLE_LINEAR';
export const TUNER_PITCH_SNAP = 'TUNER_PITCH_SNAP';
export const TUNER_PITCH_SHIFT = 'TUNER_PITCH_SHIFT';

// Integer (16bit) range

export const MIN_INT_16 = -32768;
export const MAX_INT_16 = 32767;

// Pitch shifting settings

export const DEFAULT_TUNER_WINDOW_SIZE = 256;
export const DEFAULT_TUNER_OSAMP = 64;