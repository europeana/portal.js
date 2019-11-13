// TODO: remove this when the issue noted in the url plugin is resolved upstream
import { URL } from '../url';

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

function isEntity(value) {
  return !!value && !!value.about;
}

export function thumbnailUrl(uri, params = {}) {
  const url = new URL('https://api.europeana.eu/api/v2/thumbnail-by-url.json');
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key]);
  }
  url.searchParams.set('uri', uri);
  return url.toString();
}

function entityValues(values, locale) {
  const iterableValues = ((typeof(values) === 'string') ? [values] : values || []);
  const iterableEntities = iterableValues.filter((value) => isEntity(value));
  return iterableEntities.map((value) => entityValue(value, locale));
}

function entityValue(value, locale) {
  if (value.prefLabel) {
    let entityValue = langMapValueForLocale(value.prefLabel, locale);
    if (entityValue.values.length === 0) entityValue = { code: '', values: [value.about] };
    entityValue.about = value.about;
    return entityValue;
  }
  return { code: '', values: [value.about], about: value.about };
}

const isoAlpha3Map = locales.reduce((memo, locale) => {
  memo[locale.isoAlpha3] = locale.code;
  return memo;
}, {});

const languageKeyMap = locales.reduce((memo, locale) => {
  if (locale.code === 'en') return memo;
  memo[locale.code] = [locale.code, locale.isoAlpha3];
  return memo;
}, {});

function languageKeys(currentLocale) {
  const languageKeys = languageKeyMap[currentLocale] || [];
  return languageKeys.concat(['en', 'eng', 'def', 'und']); // predefined set of preferred/fallback languages
}

/**
 * Get the localised value for the current locale, with preferred fallbacks.
 * Will return nothing if no value was found in any of the preferred locales.
 * @param {Object} The LangMap
 * @param {String} locale Current locale as a 2 letter code
 * @return {{Object[]{language: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export function langMapValueForLocale(langMap, locale) {
  let returnVal = { values: [] };
  for (let key of languageKeys(locale)) { // loop through all language key to find a match
    setLangMapValuesAndCode(returnVal, langMap, key, locale);
    if (returnVal['values'].length >= 1) break;
  }
  return addEntityValues(returnVal, entityValues(langMap['def'], locale));
}

function setLangMapValuesAndCode(returnValue, langMap, key, locale) {
  if (langMap[key]) {
    setLangMapValues(returnValue, langMap, key, locale);
    setLangCode(returnValue, key, locale);
    if (['def', 'und'].includes(key)) filterEntities(returnValue);
  }
}

function addEntityValues(localizedLangmap, localizedEntities) {
  localizedLangmap['values'] = localizedLangmap['values'].concat(localizedEntities);
  return localizedLangmap;
}

function setLangMapValues(returnValues, langMap, key) {
  returnValues['values'] = [].concat(langMap[key]);
}

function setLangCode(map, key, locale) {
  if (['def', 'und'].includes(key)) {
    map['code'] = '';
  } else {
    const langCode = normalizedLangCode(key);
    map['code'] = locale !== langCode ? langCode : null; // output if different from UI language
  }
}

function normalizedLangCode(key) {
  return key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
}

function filterEntities(mappedObject) {
  mappedObject['values'] = mappedObject['values'].filter(v => !isEntity(v));
}
