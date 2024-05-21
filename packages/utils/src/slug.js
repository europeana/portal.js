import kebabCase from 'lodash/kebabCase.js';

/**
 * Retrieves the path for an entity or gallery, based on id and name/title
 *
 * If `entityPage.name` is present, that will be used in the slug. Otherwise
 * `prefLabel.en` if present.
 *
 * @param {string} id entity/set ID, i.e. data.europeana.eu URI
 * @param {string} name the English name of the entity/set title
 * @return {string} path
 * @example
 *    const slug = getLabelledSlug(
 *      'http://data.europeana.eu/set/4279',
 *      'Dizzy Gillespie'
 *    );
 *    console.log(slug); // expected output: '4279-dizzy-gillespie'
 * @example
 *    const slug = getLabelledSlug(
 *      'http://data.europeana.eu/agent/59832',
 *      'Vincent van Gogh'
 *    );
 *    console.log(slug); // expected output: '59832-vincent-van-gogh'
 */
export const getLabelledSlug = (id, name) => {
  const numericId = id.toString().split('/').pop();
  return numericId + (name ? `-${kebabCase(name)}` : '');
};
