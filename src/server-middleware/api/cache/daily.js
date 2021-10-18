const subsetSize = 4;

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

export default (set) => {
  if (!Array.isArray(set)) {
    return set;
  }
  const offset = offsetOfTheDay(set.length);
  return set.slice(offset, offset + subsetSize);
};
