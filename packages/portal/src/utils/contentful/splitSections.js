// split the sections into individual section of a specified content type, or arrays of other content types
// e.g. to allow sections to break out from the container template and display full page width
export default (items, typeName) => {
  return items.reduce((memo, item) => {
    if (item['__typename'] === typeName) {
      memo.push(item);
    } else {
      if (!Array.isArray(memo[memo.length - 1])) {
        memo.push([]);
      }
      memo[memo.length - 1].push(item);
    }
    return memo;
  }, []);
};
