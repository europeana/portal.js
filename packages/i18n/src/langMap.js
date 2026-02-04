/**
 * @file Helper functions for working with LangMap fields from Europeana Record API
 */

import locales from './locales.js';

// i18n codes used to designate undefined locale
export const undefinedLocaleCodes = ['def', 'und'];

export const uriRegex = /^https?:\/\//; // Used to determine if a value is a URI

const isEntity = (value) => {
  return !!value && !!value.about;
};

const entityValues = (values, locale) => {
  const iterableValues = ((typeof (values) === 'string') ? [values] : values || []);
  const iterableEntities = iterableValues.filter((value) => isEntity(value));
  return iterableEntities.map((value) => entityValue(value, locale));
};

const entityValue = (value, locale) => {
  if (value.prefLabel) {
    let entityValue = langMapValueForLocale(value.prefLabel, locale);
    if (entityValue.values.length === 0) {
      entityValue = { code: '', values: [value.about] };
    }
    entityValue.about = value.about;
    return entityValue;
  }
  return { code: '', values: [value.about], about: value.about };
};

const isoAlpha3Map = locales.reduce((memo, locale) => {
  memo[locale.isoAlpha3] = locale.code;
  return memo;
}, {});

const languageKeyMap = locales.reduce((memo, locale) => {
  memo[locale.code] = [locale.code, locale.isoAlpha3, locale.iso];
  return memo;
}, {});

const localeFallbackKeys = undefinedLocaleCodes.concat(languageKeyMap.en);

const languageKeysWithFallbacks = locales.reduce((memo, locale) => {
  memo[locale.code] = languageKeyMap[locale.code] || [];

  if (locale.code !== 'en') {
    // Add English locale keys as fallbacks for other languages
    memo[locale.code] = memo[locale.code].concat(languageKeyMap.en);
  }

  memo[locale.code] = memo[locale.code].concat(undefinedLocaleCodes); // Also fallback to "undefined" language literals

  return memo;
}, {});

const languageKeys = (locale) => {
  return languageKeysWithFallbacks[locale] || localeFallbackKeys;
};

export const forEachLangMapValue = (langMapContainer, callback) => {
  for (const field in langMapContainer) {
    if (isLangMap(langMapContainer[field])) {
      for (const locale in langMapContainer[field]) {
        callback(field, locale);
      }
    }
  }
};

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
 * @return {{Object[]{code: String, values: Object[]}}} Language code and values, values may be strings or language maps themselves.
 */
export const langMapValueForLocale = (langMap, locale, options = {}) => {
  const returnVal = { values: [] };
  if (!langMap) {
    return returnVal;
  }

  setLangMapValuesAndCode(returnVal, langMap, selectLocaleForLangMap(langMap, locale));

  let withEntities = addEntityValues(returnVal, entityValues(langMap.def, locale));
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
};

const omitUrisIfOtherValues = (localizedLangmap) => {
  const withoutUris = localizedLangmap.values.filter((value) => !uriRegex.test(value));
  if (withoutUris.length > 0) {
    localizedLangmap.values = withoutUris;
  }

  return localizedLangmap;
};

const omitAllUris = (localizedLangmap) => {
  const withoutUris = localizedLangmap.values.filter((value) => !uriRegex.test(value));
  localizedLangmap.values = withoutUris;

  return localizedLangmap;
};

const localizedLangMapFromFirstNonDefValue = (langMap) => {
  for (const key in langMap) {
    if (key !== 'def') {
      return { values: langMap[key], code: key };
    }
  }
  return null;
};

const hasNonDefValues = (langMap) => {
  return Object
    .keys(langMap)
    .some(key => key !== 'def');
};

// check if values are exclusively URIs.
const onlyUriValues = (values) => {
  return values.every((value) => uriRegex.test(value));
};

const isJSONLDExpanded = (values) => {
  return values[0] && Object.prototype.hasOwnProperty.call(values[0], '@language');
};

const langMapValueFromJSONLD = (value, locale) => {
  const forCurrentLang = value.find(element => element['@language'] === locale);
  return forCurrentLang?.['@value'];
};

const setLangMapValuesAndCode = (returnValue, langMap, key) => {
  if (langMap[key]) {
    langMapValueAndCodeFromMap(returnValue, langMap, key);
  } else if (isJSONLDExpanded(langMap)) {
    langMapValueAndCodeFromJSONLD(returnValue, langMap, key);
  }
};

const langMapValueAndCodeFromMap = (returnValue, langMap, key) => {
  setLangMapValues(returnValue, langMap, key);
  setLangCode(returnValue, key);
  if (undefinedLocaleCodes.includes(key)) {
    filterEntities(returnValue);
  }
};

const langMapValueAndCodeFromJSONLD = (returnValue, langMap, key) => {
  const matchedValue = langMapValueFromJSONLD(langMap, key);
  if (matchedValue) {
    returnValue.values = [matchedValue];
  }
  setLangCode(returnValue, key);
};

const addEntityValues = (localizedLangmap, localizedEntities) => {
  localizedLangmap.values = localizedLangmap.values.concat(localizedEntities);
  return localizedLangmap;
};

const setLangMapValues = (returnValues, langMap, key) => {
  returnValues.values = [].concat(langMap[key]);
};

const setLangCode = (map, key) => {
  map.code = undefinedLocaleCodes.includes(key) ? '' : normalizedLangCode(key);
};

const normalizedLangCode = (key) => {
  return key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
};

const filterEntities = (mappedObject) => {
  mappedObject.values = mappedObject.values.filter(v => !isEntity(v));
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
