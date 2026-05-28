import EuropeanaEntityApi from '../../../plugins/europeana/entity.js';
import { reduceLangMapsForLocale } from '@europeana/i18n';

const pickFields = (entity, fields) => {
  return [].concat(fields).reduce((memo, field) => {
    memo[field] = entity[field];
    return memo;
  }, {});
};

export const fetchData = async(ids, { fields, lang } = {}, context = {}) => {
  const api = context.$apis?.entity || new EuropeanaEntityApi(context);

  let entities = await api.retrieve(ids);

  if (fields) {
    entities = entities.map((entity) => pickFields(entity, fields.split(',')));
  }
  if (lang) {
    entities = reduceLangMapsForLocale(entities, lang);
  }

  return entities;
};

export default (context = {}) => async(req, res, next) => {
  try {
    const data = await fetchData(req.body, { fields: req.query.fl, lang: req.query.lang }, context);

    res.json(data);
  } catch (e) {
    next(e);
  }
};
