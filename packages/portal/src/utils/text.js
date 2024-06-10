export const stringify = (field) => {
  let stringified = field;

  if (field && !Array.isArray(field) && (typeof field === 'object') && field.values) {
    stringified = field.values[0];
  }

  return stringified;
};

export const truncate = (text, length = 30) => {
  if (!text) {
    return null;
  }
  return text.length > length ? text.substring(0, length) + '…' : text;
};
