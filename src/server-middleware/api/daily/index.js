import { cached } from '../cache/index.js';
import { errorHandler } from '../index.js';

const subsetSize = 4;

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

export const entriesOfTheDay = (id, config = {}) => {
  return cached(id, config)
    .then(cachedEntries => {
      const offset = offsetOfTheDay(cachedEntries.length);
      return cachedEntries.slice(offset, offset + subsetSize);
    });
};

export default (id, config = {}) => (req, res) => {
  return entriesOfTheDay(id, config)
    .then(localised => res.json(localised))
    .catch(error => errorHandler(res, error));
};
