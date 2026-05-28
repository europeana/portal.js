import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';

const pickFields = (entity, fields) => {
  return [].concat(fields).reduce((memo, field) => {
    memo[field] = entity[field];
    return memo;
  }, {});
};

export const fetchData = async(ids, fields, context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  let entities = await api.retrieve(ids);

  if (fields) {
    entities = entities.map((entity) => pickFields(entity, fields));
  }

  return entities;
};

export default (context = {}) => async(req, res, next) => {
  try {
    const data = await fetchData(req.body, req.query?.fl, context);

    res.json(data);
  } catch (e) {
    next(e);
  }
};
