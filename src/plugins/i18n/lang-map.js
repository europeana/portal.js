import locales from '../i18n/locales';

const undefinedLocaleCodes = ['def', 'und'];

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

const languageKeys = locale => {
  const localeFallbackKeys = undefinedLocaleCodes.concat(languageKeyMap.en);
  return languageKeysWithFallbacks[locale] || localeFallbackKeys;
};

// if (LangMap.test(data)) {
//   const langMap = new LangMap(data);
//   langMap.localise('fr');
// }
export default class LangMap {
  // TODO: throw error if data fails .test()?
  constructor(data) {
    this.data = data;
    this.keys = Object.keys(data);
  }

  static test(candidate) {
    // TODO: is this good enough to determine lang map or not?
    const testPattern = /^[a-z]{2,3}(-[A-Z]{2})?$/;

    return (typeof candidate === 'object') &&
      Object.keys(candidate).every(key => testPattern.test(key));
  }

  static localise(data, locale) {
    return new this(data).localise(locale);
  }

  get(key) {
    return this.data[key];
  }

  key(locale) {
    for (const key of languageKeys(locale)) {
      if (this.keys.includes(key)) {
        return key;
      }
    }

    return this.keys[0];
  }

  localise(locale) {
    const key = this.key(locale);

    return { [key]: this.get(key) };
  }
}

// const htmlLangCode = (locale, key) => {
//   if (undefinedLocaleCodes.includes(key)) {
//     return '';
//   } else {
//     const langCode = normaliseLangCode(key);
//     return locale === langCode ? null : langCode; // output if different from UI language
//   }
// };

// const normaliseLangCode = key => {
//   return key.length === 3 ? isoAlpha3Map[key] : key; // if there is a match, find language code
// };

// const isoAlpha3Map = locales.reduce((memo, locale) => {
//   memo[locale.isoAlpha3] = locale.code;
//   return memo;
// }, {});
