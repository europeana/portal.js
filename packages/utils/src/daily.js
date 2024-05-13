export const dailyOffset = (setSize, subsetSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

export const daily = (set, subsetSize) => {
  if (!Array.isArray(set)) {
    return set;
  }

  const offset = dailyOffset(set.length, subsetSize);
  return set.slice(offset, offset + subsetSize);
};
