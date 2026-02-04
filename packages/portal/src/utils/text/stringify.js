export default (field) => {
  let stringified = field;

  if (field && !Array.isArray(field) && (typeof field === 'object') && field.values) {
    stringified = field.values[0];
  }

  return stringified;
};
