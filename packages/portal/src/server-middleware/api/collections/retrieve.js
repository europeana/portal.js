import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';

export const fetchData = async(ids, context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  const entities = await api.retrieve(ids);

  return entities;
};

export default (context = {}) => async(req, res, next) => {
  try {
    const data = await fetchData(req.body, context);

    res.json(data);
  } catch (e) {
    next(e);
  }
};
