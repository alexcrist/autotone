cd autotone-react;
make prod;

# Add eslint-disable to the top of the WASM build
echo "/* eslint-disable */" >> src/wasm/wasmBuild.js.temp;
cat src/wasm/wasmBuild.js >> src/wasm/wasmBuild.js.temp;
mv src/wasm/wasmBuild.js.temp src/wasm/wasmBuild.js;