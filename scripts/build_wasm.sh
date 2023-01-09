cd autotone-react;
make;
mkdir -p public/static/js;
mv src/wasm/wasmBuild.wasm public/static/js;

# Add eslint-disable to the top of the WASM build
echo "/* eslint-disable */" >> src/wasm/wasmBuild.js.temp;
cat src/wasm/wasmBuild.js >> src/wasm/wasmBuild.js.temp;
mv src/wasm/wasmBuild.js.temp src/wasm/wasmBuild.js;