import kebabCase from 'lodash/kebabCase.js';

/**
 * Retrieves the path for an entity or gallery, based on id and name
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

const LUCENE_SPECIAL_CHARACTERS = [
  '+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '/'
];

const replaceAll = (string, pattern, replacement) => string.split(pattern).join(replacement);

/**
 * Escapes Lucene syntax special characters
 * For instance, so that a string may be used in a Record API search query.
 * @param {string} unescaped Unescaped string
 * @return {string} Escaped string
 * @see https://lucene.apache.org/solr/guide/the-standard-query-parser.html#escaping-special-characters
 */
export const escapeLuceneSpecials = (unescaped, options = {}) => {
  return handleLuceneSpecials(unescaped, (escaped, char) => replaceAll(escaped, char, `\\${char}`), options);
};

/**
 * Unescapes Lucene syntax special characters
 * @param {string} escaped Escaped string
 * @return {string} Unescaped string
 */
export const unescapeLuceneSpecials = (escaped, options = {}) => {
  return handleLuceneSpecials(escaped, (unescaped, char) => replaceAll(unescaped, `\\${char}`, char), options);
};

const handleLuceneSpecials = (source, callback, { spaces = false } = {}) => {
  let chars = [].concat(LUCENE_SPECIAL_CHARACTERS);
  if (spaces) {
    chars = chars.concat(' ');
  }

  let dest = source;
  for (const char of chars) {
    dest = callback(dest, char);
  }
  return dest;
};

export const dailyOffset = (setSize, subsetSize) => {
  const millisecondsPerDay = (1000 * 60 * 60 * 24);
  const unixDay = Math.floor(Date.now() / millisecondsPerDay);
  const offset = (unixDay * subsetSize) % setSize;
  return (offset + subsetSize <= setSize) ? offset : (setSize - subsetSize);
};

export const daily = (set, subsetSize) => {
  if (!Array.isArray(set)) {
    return set;
  }

  const offset = dailyOffset(set.length, subsetSize);
  return set.slice(offset, offset + subsetSize);
};
