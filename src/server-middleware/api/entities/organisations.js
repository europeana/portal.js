import { CACHE_KEY } from '../../../cachers/entities/organisations.js';
import { createRedisClient } from '../../../cachers/utils.js';
import { errorHandler } from '../index.js';
// import { langMapValueForLocale } from '../../../plugins/europeana/utils.js';
import { getEntitySlug } from '../../../plugins/europeana/entity.js';

const localise = (unlocalised) => {
  return Object.keys(unlocalised)
    .map(id => ({
      id,
      slug: getEntitySlug(id, unlocalised[id].prefLabel.en),
      // For now only get English labels.
      // prefLabel: langMapValueForLocale(body[id].prefLabel, req.query.locale || 'en').values[0]
      prefLabel: unlocalised[id].prefLabel.en
    }))
    .filter(organisation => organisation.prefLabel);
};

export const organisations = (config = {}) => {
  const redisClient = createRedisClient(config.redis);

  return redisClient.getAsync(CACHE_KEY)
    .then(value => JSON.parse(value))
    .then(body => localise(body))
    .then(localised => {
      redisClient.quitAsync();
      return localised;
    });
};

export default (config = {}) => (req, res) => {
  if (!config.redis.url) {
    return errorHandler(res, new Error('No cache configured.'));
  }

  return organisations(config)
    .then(items => res.json(items))
    .catch(error => errorHandler(res, error));
};
