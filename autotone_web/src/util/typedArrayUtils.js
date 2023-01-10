export const concat = (array1, array2, TypedArray) => {
  const newArray = new TypedArray(array1.length + array2.length);
  newArray.set(array1);
  newArray.set(array2, array1.length);
  return newArray;
};

export const push = (array, value, TypedArray) => {
  const newArray = new TypedArray(array.length + 1);
  newArray.set(array);
  newArray[array.length] = value;
  return newArray;
};