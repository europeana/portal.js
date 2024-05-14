/**
 * Apply content tier filtering to the qf param.
 * If not present will filter to tier 1-4 content.
 * If present and of value '*' will be removed.
 * If present and any other value will be passed along as is.
 * @param {(string|string[])} params.qf query filter(s) as passed into the search plugin.
 * @return {string[]} qf adjusted with the desired content tier filter
 */
export function addContentTierFilter(qf) {
  let newQf = qf ? [].concat(qf) : [];

  if (!hasFilterForField(newQf, 'contentTier')) {
    // If no content tier qf is queried, tier 0 content is
    // excluded by default as it is considered not to meet
    // Europeana's publishing criteria.
    let contentTierFilter = '(1 OR 2 OR 3 OR 4)';

    // Exceptions:
    // 1. Tier 1 content is also excluded if this is a search filtered by collection.
    // 2. All tier content is included if filtering by organization.
    if (hasFilterForField(newQf, 'collection')) {
      contentTierFilter = '(2 OR 3 OR 4)';
    } else if (hasFilterForField(newQf, 'foaf_organization')) {
      contentTierFilter = '*';
    }
    newQf.push(`contentTier:${contentTierFilter}`);
  }

  // contentTier:* is redundant so is removed
  newQf = newQf.filter(v => v !== 'contentTier:*');

  return newQf;
}

// Some facets do not support enquoting of their field values.
export const unquotableFacets = [
  'collection', // it _may_ be quoted, but our prewarmed filters are without
  'COLOURPALETTE',
  'IMAGE_COLOUR',
  'IMAGE_GREYSCALE', // WARNING: always returns zero results anyway
  'IMAGE_SIZE',
  'MEDIA',
  'MIME_TYPE',
  'REUSABILITY',
  'SOUND_DURATION',
  'SOUND_HQ',
  'TEXT_FULLTEXT',
  'THUMBNAIL',
  'VIDEO_HD'
];

export const filtersFromQf = (qfs) => {
  const filters = {};

  for (const qf of [].concat(qfs || [])) {
    const qfParts = qf.split(':');
    const name = qfParts[0];
    const value = qfParts.slice(1).join(':');
    if (typeof filters[name] === 'undefined') {
      filters[name] = [];
    }
    filters[name].push(value);
  }

  return filters;
};

/**
 * Construct a range query from two values, if keys are omitted they will default to '*'
 * @param {Object[]} values An object containing 'start' and 'end' values
 * @return {string} The range as a value that can be used by the API
 */
export function rangeToQueryParam(values) {
  const start = values.start ? values.start : '*';
  const end = values.end ? values.end : '*';
  return `[${start} TO ${end}]`;
}

/**
 * Deconstruct a range query string value into the upper and lower bounds.
 * From/to values that are '*' will default to null.
 * @param {string} paramValue The value as a string for a qf or query as used in the search API request
 * @return {Object} Object with start and end keys
 */
export function rangeFromQueryParam(paramValue) {
  const matches = /^\[([^ ].*) TO ([^ ].*)\]$/.exec(paramValue);
  if (matches === null) {
    return null;
  }
  const start = matches[1] === '*' ? null : matches[1];
  const end = matches[2] === '*' ? null : matches[2];

  return { start, end };
}

export const hasFilterForField = (filters, fieldName) => {
  return filters.some((filter) => filter.startsWith(`${fieldName}:`));
};
