OUTPUT_FILE = -o src/wasm/wasmBuild.js
INPUT_FILES = $(wildcard ../tuner/*.c) \
							$(wildcard ../smb_pitch_shifter/*.c) \
							$(wildcard ../smb_pitch_shifter/kiss_fft/*.c) \
							$(wildcard ../reaper/*.cc) \
							$(wildcard ../reaper/REAPER/*.cc) \
							$(wildcard ../reaper/REAPER/core/*.cc) \
							$(wildcard ../reaper/REAPER/epoch_tracker/*.cc) \
							$(wildcard ../reaper/REAPER/wave/*.cc)
INCLUDE_DIRS = -I../reaper \
               -I../reaper/REAPER \
							 -I../smb_pitch_shifter

DEV_OPTIMIZATION = -O0
PROD_OPTIMIZATION = -O1

EMCC_OPTIONS = \
	-s WASM=0 \
	-s MODULARIZE=1 \
	-s ENVIRONMENT=web \
	-s FILESYSTEM=0 \
	-s NO_EXIT_RUNTIME=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_RUNTIME_METHODS=ccall,cwrap,setValue,getValue \
	-s EXPORTED_FUNCTIONS="[\
		'_malloc',\
		'_free',\
		'_pitch_detect',\
		'_get_num_pitches',\
		'_pitch_snap',\
		'_pitch_shift',\
		'_smooth'\
	]"

dev:
	emcc \
		${INPUT_FILES} \
		${OUTPUT_FILE} \
		${INCLUDE_DIRS} \
		${EMCC_OPTIONS} \
		${DEV_OPTIMIZATION}

prod:
	emcc \
		${INPUT_FILES} \
		${OUTPUT_FILE} \
		${INCLUDE_DIRS} \
		${EMCC_OPTIONS} \
		${PROD_OPTIMIZATION}
