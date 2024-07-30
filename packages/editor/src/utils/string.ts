const capitalize = (s: string) => {
  return s[0].toUpperCase() + s.slice(1);
};

const splitByCamelCase = (s: string) => {
  return s.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const labelText = (s: string) => {
  if (s.length === 0) {
    return '';
  }
  return capitalize(splitByCamelCase(s));
};
