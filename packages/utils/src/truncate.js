export const truncate = (text, length = 30) => {
  if (!text) {
    return null;
  }
  return text.length > length ? text.substring(0, length) + '…' : text;
};
