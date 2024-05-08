import kebabCase from 'lodash/kebabCase.js';

// TODO: support supplying these at runtime
import locales from '../../i18n/locales.js';

// i18n codes used to designate undefined locale
export const undefinedLocaleCodes = ['def', 'und'];

export const uriRegex = /^https?:\/\//; // Used to determine if a value is a URI

const isoAlpha3Map = locales.reduce((memo, locale) => {
  memo[locale.isoAlpha3] = locale.code;
  return memo;
}, {});

const languageKeyMap = locales.reduce((memo, locale) => {
  memo[locale.code] = [locale.code, locale.isoAlpha3, locale.iso];
  return memo;
}, {});

const languageKeysWithFallbacks = locales.reduce((memo, locale) => {
  memo[locale.code] = languageKeyMap[locale.code] || [];

  if (locale.code !== 'en') {
    // Add English locale keys as fallbacks for other languages
    memo[locale.code] = memo[locale.code].concat(languageKeyMap.en);
  }

  memo[locale.code] = memo[locale.code].concat(undefinedLocaleCodes); // Also fallback to "undefined" language literals

  return memo;
}, {});

function isEntity(value) {
  return !!value && !!value.about;
}

function entityValues(values, locale) {
  const iterableValues = ((typeof (values) === 'string') ? [values] : values || []);
  const iterableEntities = iterableValues.filter((value) => isEntity(value));
  return iterableEntities.map((value) => entityValue(value, locale));
}

function entityValue(value, locale) {
  if (value.prefLabel) {
    let entityValue = langMapValueForLocale(value.prefLabel, locale);
    if (entityValue.values.length === 0) {
      entityValue = { code: '', values: [value.about] };
    }
    entityValue.about = value.about;
    return entityValue;
  }
  return { code: '', values: [value.about], about: value.about };
}

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
export function getLabelledSlug(id, name) {
  const numericId = id.toString().split('/').pop();
  return numericId + (name ? `-${kebabCase(name)}` : '');
}

function languageKeys(locale) {
  const localeFallbackKeys = undefinedLocaleCodes.concat(languageKeyMap.en);
  return languageKeysWithFallbacks[locale] || localeFallbackKeys;
}

export const selectLocaleForLangMap = (langMap, locale) => {
  for (const key of languageKeys(locale)) {
    if (Object.prototype.hasOwnProperty.call(langMap, key)) {
      return key;
    }
  }
  if (isJSONLDExpanded(langMap)) {
    for (const key of languageKeys(locale)) {
      if (langMap.some((langValue) => langValue['@language'] === key)) {
        return key;
      }
    }
  }
  return Object.keys(langMap)[0];
};

/**
 * Get the localised value for the current locale, with preferred fallbacks.
 * Will return the first value if no value was found in any of the preferred locales.
 * Will favour non URI values even in non preferred languages if otherwise only URI(s) would be returned.
 * With the setting omitUrisIfOtherValues set to true URI values will be removed if any plain text value is available.
 * With the setting omitAllUris set to true, when no other values were found all values matching the URI pattern will be
 * omitted.
 * @param {Object} langMap The LangMap
 * @param {String} locale Preferred locale as a 2 letter code
 * @param {Boolean} options.omitUrisIfOtherValues Setting to prefer any value over URIs
 * @param {Boolean} options.omitAllUris Setting to remove all URIs
 * @return {{Object[]{language: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export function langMapValueForLocale(langMap, locale, options = {}) {
  const returnVal = { values: [] };
  if (!langMap) {
    return returnVal;
  }

  setLangMapValuesAndCode(returnVal, langMap, selectLocaleForLangMap(langMap, locale));

  let withEntities = addEntityValues(returnVal, entityValues(langMap['def'], locale));
  // In case an entity resolves as only its URI as is the case in search responses
  // as no linked entity data is returned so the prefLabel can't be retrieved.
  if (onlyUriValues(withEntities.values) && returnVal.code === '' && hasNonDefValues(langMap)) {
    withEntities = localizedLangMapFromFirstNonDefValue(langMap);
  }
  withEntities.translationSource = langMap.translationSource;
  if (options.omitAllUris) {
    return omitAllUris(withEntities);
  }
  if (!options.omitUrisIfOtherValues) {
    return withEntities;
  }
  return omitUrisIfOtherValues(withEntities);
}

function omitUrisIfOtherValues(localizedLangmap) {
  const withoutUris = localizedLangmap.values.filter((value) => !uriRegex.test(value));
  if (withoutUris.length > 0) {
    localizedLangmap.values = withoutUris;
  }

  return localizedLangmap;
}

function omitAllUris(localizedLangmap) {
  const withoutUris = localizedLangmap.values.filter((value) => !uriRegex.test(value));
  localizedLangmap.values = withoutUris;

  return localizedLangmap;
}

function localizedLangMapFromFirstNonDefValue(langMap) {
  for (const key in langMap) {
    if (key !== 'def') {
      return { values: langMap[key], code: key };
    }
  }
  return null;
}

function hasNonDefValues(langMap) {
  return Object
    .keys(langMap)
    .some(key => key !== 'def');
}

// check if values are exclusively URIs.
function onlyUriValues(values) {
  return values.every((value) => uriRegex.test(value));
}

function isJSONLDExpanded(values) {
  return values[0] && Object.prototype.hasOwnProperty.call(values[0], '@language');
}

function langMapValueFromJSONLD(value, locale) {
  const forCurrentLang = value.find(element => element['@language'] === locale);
  return forCurrentLang?.['@value'];
}

function setLangMapValuesAndCode(returnValue, langMap, key) {
  if (langMap[key]) {
    langMapValueAndCodeFromMap(returnValue, langMap, key);
  } else if (isJSONLDExpanded(langMap)) {
    langMapValueAndCodeFromJSONLD(returnValue, langMap, key);
  }
}

function langMapValueAndCodeFromMap(returnValue, langMap, key) {
  setLangMapValues(returnValue, langMap, key);
  setLangCode(returnValue, key);
  if (undefinedLocaleCodes.includes(key)) {
    filterEntities(returnValue);
  }
}

function langMapValueAndCodeFromJSONLD(returnValue, langMap, key) {
  const matchedValue = langMapValueFromJSONLD(langMap, key);
  if (matchedValue) {
    returnValue.values = [matchedValue];
  }
  setLangCode(returnValue, key);
}

function addEntityValues(localizedLangmap, localizedEntities) {
  localizedLangmap.values = localizedLangmap.values.concat(localizedEntities);
  return localizedLangmap;
}

function setLangMapValues(returnValues, langMap, key) {
  returnValues.values = [].concat(langMap[key]);
}

function setLangCode(map, key) {
  map.code = undefinedLocaleCodes.includes(key) ? '' : normalizedLangCode(key);
}

function normalizedLangCode(key) {
  return key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
}

function filterEntities(mappedObject) {
  mappedObject.values = mappedObject.values.filter(v => !isEntity(v));
}

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
export function escapeLuceneSpecials(unescaped, options = {}) {
  return handleLuceneSpecials(unescaped, (escaped, char) => replaceAll(escaped, char, `\\${char}`), options);
}

/**
 * Unescapes Lucene syntax special characters
 * @param {string} escaped Escaped string
 * @return {string} Unescaped string
 */
export function unescapeLuceneSpecials(escaped, options = {}) {
  return handleLuceneSpecials(escaped, (unescaped, char) => replaceAll(unescaped, `\\${char}`, char), options);
}

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

export const isLangMap = (value) => {
  return (typeof value === 'object') && (value.constructor.name === Object.name) && Object.keys(value).every(key => {
    // TODO: is this good enough to determine lang map or not?
    return key === 'translationSource' || /^[a-z]{2,3}(-[A-Z]{2})?$/.test(key);
  });
};

export const reduceLangMapsForLocale = (value, locale, options = {}) => {
  if (value === null) {
    return null;
  }
  const defaults = { freeze: true };
  options = { ...defaults, ...options };

  if (Array.isArray(value)) {
    return value.map((val) => reduceLangMapsForLocale(val, locale, options));
  } else if (typeof value === 'object') {
    if (Object.isFrozen(value)) {
      return value;
    } else if (isLangMap(value)) {
      const selectedLocale = selectLocaleForLangMap(value, locale);
      const langMap = {
        [selectedLocale]: value[selectedLocale]
      };
      if (value.translationSource) {
        langMap['translationSource'] = value.translationSource;
      }
      // Preserve entities from .def property
      if (selectedLocale !== 'def' && Array.isArray(value.def)) {
        langMap.def = value.def
          .filter(def => def.about)
          .map(entity => reduceLangMapsForLocale(entity, locale, options));
      }
      return options.freeze ? Object.freeze(langMap) : langMap;
    } else {
      for (const key in value) {
        value[key] = reduceLangMapsForLocale(value[key], locale, options);
      }
      return value;
    }
  } else {
    return value;
  }
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
