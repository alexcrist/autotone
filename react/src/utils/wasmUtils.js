// A helper class for loading a WASM module (C compiled with Empscripten)
// and for array<->pointer conversions

export class WasmModule {

  _Module;

  async init(createModule) {
    this._Module = await createModule();
  }

  cwrap(...cwrapArgs) {
    return (...fnCallArgs) => {
      return this._Module.ccall(...cwrapArgs, [...fnCallArgs]);
    };
  }

  // Converting JS typed arrays into pointers for passing to C functions

  int16ArrayToPointer(array) {
    return this._arrayToPointer(array, 2, 'i16');
  }
  
  float32ArrayToPointer(array) {
    return this._arrayToPointer(array, 4, 'float');
  }

  _arrayToPointer(array, bytesPerElement, dataType) {
    const numBytes = array.length * bytesPerElement;
    const pointer = this._Module._malloc(numBytes);
    for (let i = 0; i < array.length; i++) {
      const address = pointer + i * bytesPerElement;
      this._Module.setValue(address, array[i], dataType);
    }
    const free = () => this._Module._free(pointer);
    return { address: pointer, free };
  };

  // Converting pointers back to JS typed arrays
  
  pointerToInt16Array(pointer, numElements) {
    return this._pointerToArray(pointer, numElements, 2, 'i16', Int16Array);
  };

  pointerToFloat32Array(pointer, numElements) {
    return this._pointerToArray(pointer, numElements, 4, 'float', Float32Array);
  };

  _pointerToArray(pointer, numElements, bytesPerElement, dataType, TypedArray) {
    const array = new TypedArray(numElements);
    for (let i = 0; i < numElements; i++) {
      array[i] = this._Module.getValue(pointer + i * bytesPerElement, dataType);
    }
    return array;
  };
}
