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
