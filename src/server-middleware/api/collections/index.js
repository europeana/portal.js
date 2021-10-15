import { cached } from '../cache/index.js';
import { getEntitySlug } from '../../../plugins/europeana/entity.js';
import { langMapValueForLocale } from '../../../plugins/europeana/utils.js';
import { errorHandler } from '../index.js';

import { FEATURED as FEATURED_TOPICS } from '../../../cachers/collections/topics.js';

const subsetSize = 4;

const offsetOfTheDay = (setSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

const collectionsOfTheDay = (collections) => {
  const offset = offsetOfTheDay(collections.length);
  return collections.slice(offset, offset + subsetSize);
};

const featuredCollections = (type, collections) => {
  if (type === 'topics') {
    collections = collections.filter(collection => FEATURED_TOPICS.includes(collection.id));
  }
  return collectionsOfTheDay(collections);
};

const localise = (type, collections, locale) => {
  return collections.map(collection => {
    collection.slug = getEntitySlug(collection.id, collection.prefLabel?.en);
    // For organisations, only get English labels (for now).
    collection.prefLabel = type === 'organisations' ? collection.prefLabel?.en : langMapValueForLocale(collection.prefLabel, locale).values[0];
    return collection;
  })
    .filter(collection => collection.prefLabel);
};

export const cachedCollections = (type, config = {}, options = {}) => {
  return cached(`collections/${type}`, config)
    .then(collections => localise(type, collections, options.locale || 'en'))
    .then(collections => options.featured ? featuredCollections(type, collections) : collections);
};

export default (type, config = {}) => (req, res) => {
  return cachedCollections(type, config, { locale: req.query.locale, featured: req.query.featured })
    .then(collections => res.json(collections))
    .catch(error => errorHandler(res, error));
};
