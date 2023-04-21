import { selectLocaleForLangMap } from '../utils.js';

export default class LangMap {
  constructor(data, { prefLang, htmlify } = {}) {
    if (prefLang) {
      this.data = this.constructor.localise(data, prefLang, { htmlify })
    } else {
      this.data = data;
    }
  }

  // TODO: is this good enough to determine lang map or not?
  static isLangMap(data) {
    return data && (typeof data === 'object') && (data.constructor.name === Object.name) && Object.keys(data).every(key => {
      return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(key);
    });
  }

  static localise(data, prefLang, { htmlify = false } = {}) {
    const lang = this.l10nLang(data, prefLang);

    if (htmlify) {
      const htmlLang = lang === prefLang ? null : lang;
      return { lang: htmlLang, value: data[lang] };
    } else {
      return { [lang]: data[lang] };
    }
  }

  static l10nLang(data, prefLang) {
    return selectLocaleForLangMap(data, prefLang);
  }

  localise(prefLang, options = {}) {
    return this.constructor.localise(this.data, prefLang, options);
  }

  // short-hand alias for .localise()
  l() {
    return this.localise(arguments);
  }
}
