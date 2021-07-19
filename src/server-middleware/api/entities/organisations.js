const cacher = require('../../../cachers/entities/organisations');
import { errorHandler } from '../';
// import { langMapValueForLocale } from '../../../plugins/europeana/utils';
import { getEntitySlug } from '../../../plugins/europeana/entity';

export default (options = {}) => (req, res) => {
  if (!options.redis.url) {
    return errorHandler(res, new Error('No cache configured for organisations.'));
  }

  return cacher.get({
    redisUrl: options.redis.url,
    redisTlsCa: options.redis.tlsCa
  })
    .then(({ body }) => {
      return Object.keys(body).map(id => ({
        id,
        slug: getEntitySlug(id, body[id].prefLabel.en),
        // For now only get English labels.
        // prefLabel: langMapValueForLocale(body[id].prefLabel, req.query.locale || 'en').values[0]
        prefLabel: body[id].prefLabel.en
      })).filter(organisation => organisation.prefLabel);
    })
    .then(localised => res.json(localised))
    .catch(error => errorHandler(res, error));
};
