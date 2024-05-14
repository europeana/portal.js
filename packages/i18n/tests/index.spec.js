import * as index from '@/index.js';

describe('i18n/index', () => {
  describe('exports', () => {
    it('has the function forEachLangMapValue', () => {
      expect(typeof index.forEachLangMapValue).toBe('function');
    });
    it('has the function isLangMap', () => {
      expect(typeof index.isLangMap).toBe('function');
    });
    it('has the function langMapValueForLocale', () => {
      expect(typeof index.langMapValueForLocale).toBe('function');
    });
    it('has the function reduceLangMapsForLocale', () => {
      expect(typeof index.reduceLangMapsForLocale).toBe('function');
    });
    it('has the function selectLocaleForLangMap', () => {
      expect(typeof index.selectLocaleForLangMap).toBe('function');
    });
    it('has the object undefinedLocaleCodes', () => {
      expect(typeof index.undefinedLocaleCodes).toBe('object');
    });
    it('has the object uriRegex', () => {
      expect(typeof index.uriRegex).toBe('object');
    });
    it('has the object codes', () => {
      expect(typeof index.codes).toBe('object');
    });
    it('has the object locales', () => {
      expect(typeof index.locales).toBe('object');
    });
  });
});
