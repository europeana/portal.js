import { langAttribute } from './langAttribute.js';

describe('@/utils/langAttribute.js', () => {
  describe('langAttribute', () => {
    it('returns null if lang matches i18n locale', () => {
      const locale = 'fr';
      const lang = 'fr';

      const attr = langAttribute(lang, locale);

      expect(attr).toBeNull();
    });

    it('returns lang if it does not match i18n locale', () => {
      const locale = 'fr';
      const lang = 'nl';

      const attr = langAttribute(lang, locale);

      expect(attr).toBe(lang);
    });
  });
});
