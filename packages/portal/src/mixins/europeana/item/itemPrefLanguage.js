const ENGLISH_LOCALE_CODE = 'en';

export default {
  methods: {
    getNativeLocale(fieldData) {
      const langMap = fieldData.url ? fieldData.value : fieldData;
      const nativeLocaleDefinable = langMap.def?.[0]?.prefLabel &&
        Object.keys(langMap.def[0].prefLabel).length <= 2;
      const nativeLocale =  nativeLocaleDefinable &&
        (Object.keys(langMap.def[0].prefLabel).find(key => key !== ENGLISH_LOCALE_CODE) || ENGLISH_LOCALE_CODE);

      return nativeLocale;
    },

    getPrefLanguage(fieldName, fieldData) {
      let nativeLocale;
      if (['edmDataProvider', 'edmProvider'].includes(fieldName)) {
        nativeLocale = this.getNativeLocale(fieldData);
      }
      return nativeLocale || this.metadataLanguage || this.$i18n.locale;
    }
  }
};
