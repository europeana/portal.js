const getOrganisations = require('../../../cachers/entities/organisations/get');
const { errorHandler } = import('../');

export default (options = {}) => (req, res) => {
  getOrganisations({
    redisUrl: options.redis.url,
    redisTlsCa: options.redis.tlsCa
  })
    .then(({ body }) => res.json(body))
    .catch(error => errorHandler(res, error));
};
