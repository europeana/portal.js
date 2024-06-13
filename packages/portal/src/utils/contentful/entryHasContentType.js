export default (entry, contentType) => {
  return entry && (entry['__typename'] === contentType);
};
