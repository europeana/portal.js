import * as utils from '@/plugins/europeana/utils';
import sinon from 'sinon';

describe('plugins/europeana/utils', () => {
  describe('createAxios', () => {
    it('uses app.$axiosLogger from context as request interceptor', () => {
      const $axiosLogger = (requestConfig) => requestConfig;
      const context = {
        app: { $axiosLogger }
      };
      const axiosInstance = utils.createAxios({}, context);

      expect(axiosInstance.interceptors.request.handlers.some((handler) => {
        return handler.fulfilled === $axiosLogger;
      })).toBe(true);
    });
  });

  describe('apiUrlFromRequestHeaders()', () => {
    it('returns lowercased X-Europeana-${API}-API-URL header', () => {
      const url = 'https://alternate.example.org';
      const headers = {
        'x-europeana-record-api-url': url
      };

      expect(utils.apiUrlFromRequestHeaders('record', headers)).toBe(url);
    });
  });

  describe('escapeLuceneSpecials', () => {
    it('escapes Lucene special characters', () => {
      const unescaped = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : /';

      const escaped = utils.escapeLuceneSpecials(unescaped);

      expect(escaped).toBe('\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/');
    });
  });

  describe('unescapeLuceneSpecials', () => {
    it('unescapes Lucene special characters', () => {
      const escaped = '\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/';

      const unescaped = utils.unescapeLuceneSpecials(escaped);

      expect(unescaped).toBe('+ - & | ! ( ) { } [ ] ^ " ~ * ? : /');
    });
  });

  describe('isLangMap()', () => {
    it('accepts 2-letter codes', () => {
      const value = {
        en: 'English',
        fr: 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('accepts 3-letter codes', () => {
      const value = {
        def: 'Default',
        eng: 'English',
        fra: 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('accepts 2-letter codes with country code', () => {
      const value = {
        'en-GB': 'English',
        'fr-FR': 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      expect(isLangMap).toBe(true);
    });

    it('rejects other keys', () => {
      const value = {
        about: 'http://data.europeana.eu/concept/123'
      };

      const isLangMap = utils.isLangMap(value);

      expect(isLangMap).toBe(false);
    });
  });

  describe('selectLocaleForLangMap()', () => {
    const locale = 'en';

    it('first selects 2-letter code if present', () => {
      const langMap = { en: 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('en');
    });

    it('second selects 3-letter code if present', () => {
      const langMap = { eng: 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('eng');
    });

    it('third selects 2-letter code with country code if present', () => {
      const langMap = { 'en-GB': 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('en-GB');
    });

    it('fourth selects "def" if present', () => {
      const langMap = { def: 'Default', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('def');
    });

    it('fifth selects "und" if present', () => {
      const langMap = { und: 'Undefined', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('und');
    });

    describe('when theLangMap is in fact an expanded JSONLD object', () => {
      it('first selects 2-letter code if present', () => {
        const langMap = [{ '@language': 'en', '@value': 'English' }, { '@language': 'fr', '@value': 'Français' }];

        const selected = utils.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('en');
      });

      it('second selects 3-letter code if present', () => {
        const langMap = [{ '@language': 'eng', '@value': 'English' }, { '@language': 'fra', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('eng');
      });

      it('third selects 2-letter code with country code if present', () => {
        const langMap = [{ '@language': 'en-GB', '@value': 'English' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('en-GB');
      });

      it('fourth selects "def" if present', () => {
        const langMap = [{ '@language': 'def', '@value': 'undefined' }, { '@language': 'fr', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('def');
      });

      it('fifth selects "und" if present', () => {
        const langMap = [{ '@language': 'und', '@value': 'undefined' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        expect(selected).toBe('und');
      });
    });

    it('finally selects first key', () => {
      const langMap = { fr: 'Français', nl: 'Nederlands' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      expect(selected).toBe('fr');
    });
  });

  describe('getLabelledSlug', () => {
    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = utils.getLabelledSlug('http://data.euroepana.eu/concept/147831', 'Architecture');
      expect(slug).toBe('147831-architecture');
    });
  });

  describe('reduceLangMapsForLocale', () => {
    const locale = 'fr';

    it('reduces arrays for locale', () => {
      const value = [
        { en: 'English 1', fr: 'Français 1' },
        { en: 'English 2', fr: 'Français 2' }
      ];

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual([
        { fr: 'Français 1' },
        { fr: 'Français 2' }
      ]);
    });

    it('reduces objects for locale', () => {
      const value = { en: 'English', fr: 'Français' };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({ fr: 'Français' });
    });

    it('preserves the translationSource', () => {
      const value = { en: 'English', fr: 'Français', translationSource: 'automated' };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({ fr: 'Français', translationSource: 'automated' });
    });

    it('preserves entities on "def"', () => {
      const value = {
        def: [{ about: 'http://data.europeana.eu/concept/123' }],
        en: 'English',
        fr: 'Français'
      };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      expect(reduced).toEqual({
        def: [{ about: 'http://data.europeana.eu/concept/123' }],
        fr: 'Français'
      });
    });

    it('returns other value types untouched', () => {
      const value = 'English';

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      expect(reduced).toBe(value);
    });
  });

  describe('daily', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.daily(argument, 4);

      expect(filtered).toBe(argument);
    });

    it('filters Array arguments to requested number for the current day', () => {
      const argument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const tests = [
        { now: 0, expected: [0, 1, 2, 3] },
        { now: 1634556628480, expected: [3, 4, 5, 6] }
      ];

      for (const test of tests) {
        sinon.stub(Date, 'now').returns(test.now);
        const filtered = utils.daily(argument, 4);
        expect(filtered).toEqual(test.expected);
        Date.now.restore();
      }
    });
  });
});
