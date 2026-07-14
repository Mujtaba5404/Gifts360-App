const normalizeArray = (value) => {
  if (value == null) return [];

  return Array.isArray(value) ? value : [value];
};

export default normalizeArray;
