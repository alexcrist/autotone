OUTPUT_FILE = -o src/audio/pitchShifting/wasm/tunerWasm.js

INPUT_FILES = $(wildcard ../tuner/*.c) \
							$(wildcard ../smb_pitch_shifter/*.c) \
							$(wildcard ../smb_pitch_shifter/kiss_fft/*.c)

INCLUDE_DIRS = -I../smb_pitch_shifter

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
		'_upsample_linear',\
		'_pitch_snap',\
		'_pitch_shift'\
	]"

wasm:
	mkdir -p src/audio/pitchShifting/wasm;
	emcc \
		${INPUT_FILES} \
		${OUTPUT_FILE} \
		${INCLUDE_DIRS} \
		${EMCC_OPTIONS} \
		${OPTIMIZATION}
