// Web worker message types

export const TUNER_INIT = 'TUNER_INIT';
export const TUNER_GET_NUM_WINDOWS = 'TUNER_GET_NUM_WINDOWS';
export const TUNER_UPSAMPLE_LINEAR = 'TUNER_UPSAMPLE_LINEAR';
export const TUNER_PITCH_SNAP = 'TUNER_PITCH_SNAP';
export const TUNER_PITCH_SHIFT = 'TUNER_PITCH_SHIFT';

// Integer (16bit) range

export const MIN_INT_16 = -32768;
export const MAX_INT_16 = 32767;

// Pitch shifting settings

export const PITCH_SHIFTING_WINDOW_SIZE = 1024;
export const PITCH_SHIFTING_OSAMP = 32;