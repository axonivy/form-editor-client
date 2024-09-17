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

export const simpleType = (type: string): string => {
  const typeParts = type.split('.');
  return typeParts[typeParts.length - 1];
};

export const typesString = (parameters: Array<{ type: string }>): string => {
  return parameters.map(param => simpleType(param.type)).join(', ');
};
