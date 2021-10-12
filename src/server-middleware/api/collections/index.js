import { cached } from '../cache/index.js';
import { getEntitySlug } from '../../../plugins/europeana/entity.js';
// import { langMapValueForLocale } from '../../../plugins/europeana/utils.js';
import { errorHandler } from '../index.js';

const localise = (unlocalised) => {
  return Object.keys(unlocalised)
    .map(id => ({
      id,
      slug: getEntitySlug(id, unlocalised[id].prefLabel?.en),
      // For now only get English labels.
      // prefLabel: langMapValueForLocale(body[id].prefLabel, req.query.locale || 'en').values[0]
      prefLabel: unlocalised[id].prefLabel?.en
    }))
    .filter(collection => collection.prefLabel);
};

export default (type, config = {}) => (req, res) => {
  return cached(`collections/${type}`, config)
    .then(cachedEntries => localise(cachedEntries))
    .then(localised => res.json(localised))
    .catch(error => errorHandler(res, error));
};
