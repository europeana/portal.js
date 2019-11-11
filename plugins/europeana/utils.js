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

function entityValues(values, locale) {
  return ((typeof(values) === 'string') ? [values] : values || []).filter((value) => isEntity(value))
    .map((value) => entityValue(value, locale));
}

function entityValue(value, locale) {
  if (value.prefLabel) {
    const entityValue = langMapValueForLocale(value.prefLabel, locale);
    entityValue.about = value.about;
    if (entityValue.values.length === 0) entityValue.values = [value.about];
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
 * @param {Object} locale current locale will be 2 letter code
 * @return {{Object[]{language: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export function langMapValueForLocale(langMap, locale) {
  let returnVal = { values: [] };
  for (let key of languageKeys(locale)) { // loop through all language key to find a match
    if (langMap[key]) {
      let htmlLang = '';
      let values = [].concat(langMap[key]);
      if (key !== 'def' && key !== 'und') {
        const langCode = key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
        htmlLang = locale !== langCode ? langCode : null; // output if different from UI language
      } else {
        values = values.filter(v => !isEntity(v));
      }
      returnVal['code'] = htmlLang;
      returnVal['values'] = values;
      if (returnVal['values'].length >= 1) {
        break;
      }
    }
  }
  returnVal['values'] = returnVal['values'].concat(entityValues(langMap['def'], locale));
  return returnVal;
}
