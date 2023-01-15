export const classNames = (...classes) => {
  let classString = '';
  for (let i = 0; i < classes.length; i++) {
    if (classes[i]) {
      classString += classes[i] + ' ';
    }
  }
  return classString;
};