const getOrganisations = require('../../../cachers/entities/organisations/get');
import { errorHandler } from '../';
import { langMapValueForLocale } from '../../../plugins/europeana/utils';
import { getEntitySlug } from '../../../plugins/europeana/entity';

export default (options = {}) => (req, res) => {
  if (!options.redis.url) {
    return errorHandler(res, new Error('No cache configured for organisations.'));
  }

  return getOrganisations({
    redisUrl: options.redis.url,
    redisTlsCa: options.redis.tlsCa
  })
    .then(({ body }) => {
      return Object.keys(body).map(id => ({
        id,
        slug: getEntitySlug(id, body[id].prefLabel.en),
        prefLabel: langMapValueForLocale(body[id].prefLabel, req.query.locale || 'en').values[0]
      }));
    })
    .then(localised => res.json(localised))
    .catch(error => errorHandler(res, error));
};
