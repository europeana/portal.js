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

const locales = require('../i18n/locales.json');

function isEntity(value) {
  return !!value && !!value.about;
}

function entityValues(values, locale) {
  let entityValues = [];
  if (!values)  {
    return entityValues;
  }
  for (const value of values) {
    if (isEntity(value)) {
      let entityValue = {};
      if (value.prefLabel)  {
        entityValue = langMapValueForLocale(value.prefLabel, locale);
        entityValue['about'] = value.about;
      } else {
        entityValue = { code: 'und', values: [value.about], about: value.about };
      }
      entityValues = entityValues.concat(entityValue);
    }
  }
  return entityValues;
}

/**
 * Get the localised value for the current locale, with preferred fallbacks.
 * Will return nothing if no value was found in any of the preferred locales.
 * @param {Object} The LangMap
 * @param {Object} locale current locale
 * @return {{Object[]{language: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export function langMapValueForLocale(langMap, locale) {
  let languageKeys = ['en', 'eng', 'def', 'und']; // predefined set of preferred/fallback languages
  const currentLocale = locales.find(l => l.code === locale);

  if (currentLocale.code !== 'en') { // if language code is not en, add both 2 and 3 character language code to preferred languages
    languageKeys.unshift(currentLocale.code);
    languageKeys.unshift(currentLocale.isoAlpha3);
  }

  let returnVal = { values: [] };
  for (let key of languageKeys) { // loop through all language key to find a match
    if (langMap[key]) {
      let htmlLang = '';
      let values = [].concat(langMap[key]);
      if (key !== 'def' && key !== 'und') {
        const langCode = key.length === 3 ? locales.find(l => l.isoAlpha3 === key).code : key; // if there is a match, find language code
        htmlLang = currentLocale.code !== langCode ? langCode : ''; // output if different from UI language
      } else {
        values = values.filter(v => !isEntity(v));
      }
      returnVal['code'] = htmlLang;
      returnVal['values'] = values;
    }
  }
  returnVal['values'] = returnVal['values'].concat(entityValues(langMap['def'], locale));
  return returnVal;
}
