import * as langMapImports from '@/langMap';

describe('i18n/langMap', () => {
  describe('isLangMap()', () => {
    it('accepts 2-letter codes', () => {
      const value = {
        en: 'English',
        fr: 'Français'
      };

      const isLangMap = langMapImports.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('accepts 3-letter codes', () => {
      const value = {
        def: 'Default',
        eng: 'English',
        fra: 'Français'
      };

      const isLangMap = langMapImports.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('accepts 2-letter codes with country code', () => {
      const value = {
        'en-GB': 'English',
        'fr-FR': 'Français'
      };

      const isLangMap = langMapImports.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('rejects other keys', () => {
      const value = {
        about: 'http://data.europeana.eu/concept/123'
      };

      const isLangMap = langMapImports.isLangMap(value);

      expect(isLangMap).toBe(false);
    });
  });

  describe('selectLocaleForLangMap()', () => {
    const locale = 'en';

    it('first selects 2-letter code if present', () => {
      const langMap = { en: 'English', fr: 'Français' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('en');
    });

    it('second selects 3-letter code if present', () => {
      const langMap = { eng: 'English', fr: 'Français' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('eng');
    });

    it('third selects 2-letter code with country code if present', () => {
      const langMap = { 'en-GB': 'English', fr: 'Français' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('en-GB');
    });

    it('fourth selects "def" if present', () => {
      const langMap = { def: 'Default', fr: 'Français' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('def');
    });

    it('fifth selects "und" if present', () => {
      const langMap = { und: 'Undefined', fr: 'Français' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('und');
    });

    describe('when theLangMap is in fact an expanded JSONLD object', () => {
      it('first selects 2-letter code if present', () => {
        const langMap = [{ '@language': 'en', '@value': 'English' }, { '@language': 'fr', '@value': 'Français' }];

        const selected = langMapImports.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('en');
      });

      it('second selects 3-letter code if present', () => {
        const langMap = [{ '@language': 'eng', '@value': 'English' }, { '@language': 'fra', '@value': 'Français' }];
        const selected = langMapImports.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('eng');
      });

      it('third selects 2-letter code with country code if present', () => {
        const langMap = [{ '@language': 'en-GB', '@value': 'English' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = langMapImports.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('en-GB');
      });

      it('fourth selects "def" if present', () => {
        const langMap = [{ '@language': 'def', '@value': 'undefined' }, { '@language': 'fr', '@value': 'Français' }];
        const selected = langMapImports.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('def');
      });

      it('fifth selects "und" if present', () => {
        const langMap = [{ '@language': 'und', '@value': 'undefined' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = langMapImports.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('und');
      });
    });

    it('finally selects first key', () => {
      const langMap = { fr: 'Français', nl: 'Nederlands' };

      const selected = langMapImports.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('fr');
    });
  });

  describe('reduceLangMapsForLocale', () => {
    const locale = 'fr';

    it('reduces arrays for locale', () => {
      const value = [
        { en: 'English 1', fr: 'Français 1' },
        { en: 'English 2', fr: 'Français 2' }
      ];

      const reduced = langMapImports.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual([
        { fr: 'Français 1' },
        { fr: 'Français 2' }
      ]);
    });

    it('reduces objects for locale', () => {
      const value = { en: 'English', fr: 'Français' };

      const reduced = langMapImports.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({ fr: 'Français' });
    });

    it('preserves the translationSource', () => {
      const value = { en: 'English', fr: 'Français', translationSource: 'automated' };

      const reduced = langMapImports.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({ fr: 'Français', translationSource: 'automated' });
    });

    it('preserves entities on "def"', () => {
      const value = {
        def: [{ about: 'http://data.europeana.eu/concept/123' }],
        en: 'English',
        fr: 'Français'
      };

      const reduced = langMapImports.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({
        def: [{ about: 'http://data.europeana.eu/concept/123' }],
        fr: 'Français'
      });
    });

    it('returns other value types untouched', () => {
      const value = 'English';

      const reduced = langMapImports.reduceLangMapsForLocale(value, locale);

      expect(reduced).toBe(value);
    });
  });
});
