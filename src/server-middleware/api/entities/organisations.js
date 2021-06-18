const fetchOrganisations = require('../../../serverless/entities/organisations/fetch');
const { errorHandler } = import('../');

export default (options = {}) => (req, res) => {
  fetchOrganisations.main({
    redisUrl: options.redis.url,
    redisTlsCa: options.redis.tlsCa
  })
    .then(({ body }) => res.json(body))
    .catch(error => errorHandler(res, error));
};
