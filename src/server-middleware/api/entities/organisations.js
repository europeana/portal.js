const getOrganisations = require('../../../cachers/entities/organisations/get');
import { errorHandler } from '../';

export default (options = {}) => (req, res) => {
  if (!options.redis.url) {
    return errorHandler(res, new Error('No cache configured for organisations.'));
  }

  return getOrganisations({
    redisUrl: options.redis.url,
    redisTlsCa: options.redis.tlsCa
  })
    .then(({ body }) => res.json(body))
    .catch(error => errorHandler(res, error));
};
