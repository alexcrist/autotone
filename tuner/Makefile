OUTPUT_DIR = ../react/src/audio/pitchShifting/wasm
OUTPUT_FILE = -o ${OUTPUT_DIR}/tunerWasm.js

INPUT_FILES = $(wildcard *.c) \
              $(wildcard smb_pitch_shift/*.c) \
              $(wildcard kiss_fft/*.c)

OPTIMIZATION = -O1

EMCC_OPTIONS = \
	-s WASM=1 \
	-s MODULARIZE=1 \
	-s ENVIRONMENT=web \
	-s FILESYSTEM=0 \
	-s NO_EXIT_RUNTIME=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_RUNTIME_METHODS=ccall,cwrap,setValue,getValue \
	-s EXPORTED_FUNCTIONS="[\
		'_malloc',\
		'_free',\
		'_get_num_windows',\
		'_resample_linear',\
		'_pitch_snap',\
		'_pitch_shift'\
	]"

wasm:
	mkdir -p ${OUTPUT_DIR}
	emcc \
		${INPUT_FILES} \
		${OUTPUT_FILE} \
		${INCLUDE_DIRS} \
		${EMCC_OPTIONS} \
		${OPTIMIZATION}
