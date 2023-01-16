import * as tf from '@tensorflow/tfjs';

// Web worker message types

export const CREPE_GET_BUFFER_SIZE = 'CREPE_GET_BUFFER_SIZE';
export const CREPE_INIT = 'CREPE_INIT';
export const CREPE_DETECT_PITCHES = 'CREPE_DETECT_PITCHES';

// TensorFlow model

export const CREPE_SAMPLE_RATE = 16000;
export const CREPE_MIN_WINDOW_SIZE = 1024;
export const CENT_MAPPING = tf.add(tf.linspace(0, 7180, 360), tf.tensor(1997.3794084376191));

// Configurable pitch detection settings

export const DEFAULT_CREPE_OSAMP = 8;
