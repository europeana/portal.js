import { cached } from '../../cache/index.js';

export const fetchData = async(config = {}) => {
  const key = 'collections:organisations:geo';

  const data = await cached(key, config);

  return data[key] || {};
};

export default (config = {}) => async(req, res, next) => {
  try {
    const data = await fetchData(config);

    res.json(data);
  } catch (e) {
    next(e);
  }
};
