import axios from 'axios';

import { keycloakResponseErrorHandler } from './auth';

export const createAxios = ({ id, baseURL, $axios }, context) => {
  const axiosOptions = axiosInstanceOptions({ id, baseURL }, context);
  const axiosInstance = ($axios || axios).create(axiosOptions);

  const app = context.app;
  if (app && app.$axiosLogger) {
    axiosInstance.interceptors.request.use(app.$axiosLogger);
  }

  return axiosInstance;
};

export const createKeycloakAuthAxios = ({ id, baseURL, $axios }, context) => {
  const axiosInstance = createAxios({ id, baseURL, $axios }, context);

  if (typeof axiosInstance.onResponseError === 'function') {
    axiosInstance.onResponseError(error => keycloakResponseErrorHandler(context, error));
  }

  return axiosInstance;
};

const storedAPIBaseURL = (store, id) => {
  if (store && store.state && store.state.apis && store.state.apis.urls[id]) {
    return store.state.apis.urls[id];
  }
};

const apiConfig = ($config, id) => {
  if ($config && $config.europeana && $config.europeana.apis && $config.europeana.apis[id]) {
    return $config.europeana.apis[id];
  } else {
    return {};
  }
};

const axiosInstanceOptions = ({ id, baseURL }, { store, $config }) => {
  const config = apiConfig($config, id);
  return {
    baseURL: storedAPIBaseURL(store, id) || config.url || baseURL,
    params: {
      wskey: config.key
    }
  };
};

// TODO: extend to be more verbose in development environments, e.g. with stack trace
export function apiError(error) {
  let statusCode = 500;
  let message = error.message;

  if (error.response) {
    statusCode = error.response.status;
    message = error.response.data.error;
  }

  const apiError = new Error(message);
  apiError.statusCode = statusCode;
  return apiError;
}

const locales = require('../i18n/locales.js');
const undefinedLocaleCodes = ['def', 'und'];
const uriRegex = /^https?:\/\//; // Used to determine if a value is a URI

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
  return Object.keys(langMap)[0];
};

/**
 * Get the localised value for the current locale, with preferred fallbacks.
 * Will return the first value if no value was found in any of the preferred locales.
 * Will favour non URI values even in non preferred languages if otherwise only URI(s) would be returned.
 * With the setting omitUrisIfOtherValues set to true URI values will be removed if any plain text value is available.
 * With the setting omitAllUris set to true, when no other values were found all values matching the URI pattern will be
 * omitted.
 * @param {Object} The LangMap
 * @param {String} locale Current locale as a 2 letter code
 * @param {Boolean} options.omitUrisIfOtherValues Setting to prefer any value over URIs
 * @param {Boolean} options.omitAllUris Setting to remove all URIs
 * @return {{Object[]{language: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export function langMapValueForLocale(langMap, locale, options = {}) {
  let returnVal = { values: [] };
  if (!langMap) {
    return returnVal;
  }

  setLangMapValuesAndCode(returnVal, langMap, selectLocaleForLangMap(langMap, locale), locale);

  let withEntities = addEntityValues(returnVal, entityValues(langMap['def'], locale));
  // In case an entity resolves as only its URI as is the case in search responses
  // as no linked entity data is returned so the prefLabel can't be retrieved.
  if (onlyUriValues(withEntities.values) && returnVal.code === '' && hasNonDefValues(langMap)) {
    withEntities = localizedLangMapFromFirstNonDefValue(langMap);
  }
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
  for (let key in langMap) {
    if (key !== 'def') {
      return { values: langMap[key], code: key };
    }
  }
}

function hasNonDefValues(langMap) {
  const keys = Object.keys(langMap);
  return  keys.some((key) => {
    return key !== 'def';
  });
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
  return forCurrentLang && forCurrentLang['@value'];
}

function setLangMapValuesAndCode(returnValue, langMap, key, locale) {
  if (langMap[key]) {
    langMapValueAndCodeFromMap(returnValue, langMap, key, locale);
  } else if (isJSONLDExpanded(langMap)) {
    langMapValueAndCodeFromJSONLD(returnValue, langMap, key, locale);
  }
}

function langMapValueAndCodeFromMap(returnValue, langMap, key, locale) {
  setLangMapValues(returnValue, langMap, key);
  setLangCode(returnValue, key, locale);
  if (undefinedLocaleCodes.includes(key)) {
    filterEntities(returnValue);
  }
}

function langMapValueAndCodeFromJSONLD(returnValue, langMap, key, locale) {
  const matchedValue = langMapValueFromJSONLD(langMap, key);
  if (matchedValue) {
    returnValue.values = [matchedValue];
  }
  setLangCode(returnValue, key, locale);
}

function addEntityValues(localizedLangmap, localizedEntities) {
  localizedLangmap.values = localizedLangmap.values.concat(localizedEntities);
  return localizedLangmap;
}

function setLangMapValues(returnValues, langMap, key) {
  returnValues.values = [].concat(langMap[key]);
}

function setLangCode(map, key, locale) {
  if (undefinedLocaleCodes.includes(key)) {
    map['code'] = '';
  } else {
    const langCode = normalizedLangCode(key);
    map['code'] = locale === langCode ? null : langCode; // output if different from UI language
  }
}

function normalizedLangCode(key) {
  return key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
}

function filterEntities(mappedObject) {
  mappedObject.values = mappedObject.values.filter(v => !isEntity(v));
}

export function apiUrlFromRequestHeaders(api, headers) {
  return headers[`x-europeana-${api}-api-url`];
}

/**
 * Escapes Lucene syntax special characters
 * For instance, so that a string may be used in a Record API search query.
 * @param {string} unescaped Unescaped string
 * @return {string} Escaped string
 * @see https://lucene.apache.org/solr/guide/the-standard-query-parser.html#escaping-special-characters
 */
export function escapeLuceneSpecials(unescaped) {
  const escapePattern = /([+\-&|!(){}[\]^"~*?:/"])/g; // Lucene reserved characters
  return unescaped.replace(escapePattern, '\\$1');
}

/**
 * Unescapes Lucene syntax special characters
 * @param {string} escaped Escaped string
 * @return {string} Unescaped string
 */
export function unescapeLuceneSpecials(escaped) {
  const unescapePattern = /\\([+\-&|!(){}[\]^"~*?:/"])/g; // Lucene reserved characters
  return escaped.replace(unescapePattern, '$1');
}

export const isLangMap = (value) => {
  return (typeof value === 'object') && Object.keys(value).every(key => {
    // TODO: is this good enough to determine lang map or not?
    return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(key);
  });
};

export const reduceLangMapsForLocale = (value, locale) => {
  if (Array.isArray(value)) {
    return value.map(val => reduceLangMapsForLocale(val, locale));
  } else if (typeof value === 'object') {
    if (isLangMap(value)) {
      const selectedLocale = selectLocaleForLangMap(value, locale);
      const langMap = {
        [selectedLocale]: value[selectedLocale]
      };
      // Preserve entities from .def property
      if (selectedLocale !== 'def' && Array.isArray(value.def)) {
        langMap.def = value.def
          .filter(def => def.about)
          .map(entity => reduceLangMapsForLocale(entity, locale));
      }
      return Object.freeze(langMap);
    } else {
      return Object.keys(value).reduce((memo, key) => {
        memo[key] = reduceLangMapsForLocale(value[key], locale);
        return memo;
      }, {});
    }
  } else {
    return value;
  }
};
