import * as utils from '@/plugins/europeana/utils';

describe('plugins/europeana/utils', () => {
  describe('apiUrlFromRequestHeaders()', () => {
    it('returns lowercased X-Europeana-${API}-API-URL header', () => {
      const url = 'https://alternate.example.org';
      const headers = {
        'x-europeana-record-api-url': url
      };

      utils.apiUrlFromRequestHeaders('record', headers).should.eq(url);
    });
  });

  describe('escapeLuceneSpecials', () => {
    it('escapes Lucene special characters', () => {
      const unescaped = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : /';

      const escaped = utils.escapeLuceneSpecials(unescaped);

      escaped.should.eq('\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/');
    });
  });

  describe('unescapeLuceneSpecials', () => {
    it('unescapes Lucene special characters', () => {
      const escaped = '\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/';

      const unescaped = utils.unescapeLuceneSpecials(escaped);

      unescaped.should.eq('+ - & | ! ( ) { } [ ] ^ " ~ * ? : /');
    });
  });

  describe('isLangMap()', () => {
    it('accepts 2-letter codes', () => {
      const value = {
        en: 'English',
        fr: 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      isLangMap.should.be.true;
    });

    it('accepts 3-letter codes', () => {
      const value = {
        def: 'Default',
        eng: 'English',
        fra: 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      isLangMap.should.be.true;
    });

    it('accepts 2-letter codes with country code', () => {
      const value = {
        'en-GB': 'English',
        'fr-FR': 'Français'
      };

      const isLangMap = utils.isLangMap(value);

      isLangMap.should.be.true;
    });

    it('rejects other keys', () => {
      const value = {
        about: 'http://data.europeana.eu/concept/base/123'
      };

      const isLangMap = utils.isLangMap(value);

      isLangMap.should.be.false;
    });
  });

  describe('selectLocaleForLangMap()', () => {
    const locale = 'en';

    it('first selects 2-letter code if present', () => {
      const langMap = { en: 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('en');
    });

    it('second selects 3-letter code if present', () => {
      const langMap = { eng: 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('eng');
    });

    it('third selects 2-letter code with country code if present', () => {
      const langMap = { 'en-GB': 'English', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('en-GB');
    });

    it('fourth selects "def" if present', () => {
      const langMap = { def: 'Default', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('def');
    });

    it('fifth selects "und" if present', () => {
      const langMap = { und: 'Undefined', fr: 'Français' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('und');
    });

    context('when theLangMap is in fact an expanded JSONLD object', () => {
      it('first selects 2-letter code if present', () => {
        const langMap = [{ '@language': 'en', '@value': 'English' }, { '@language': 'fr', '@value': 'Français' }];

        const selected = utils.selectLocaleForLangMap(langMap, locale);
        selected.should.eq('en');
      });

      it('second selects 3-letter code if present', () => {
        const langMap = [{ '@language': 'eng', '@value': 'English' }, { '@language': 'fra', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        selected.should.eq('eng');
      });

      it('third selects 2-letter code with country code if present', () => {
        const langMap = [{ '@language': 'en-GB', '@value': 'English' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        selected.should.eq('en-GB');
      });

      it('fourth selects "def" if present', () => {
        const langMap = [{ '@language': 'def', '@value': 'undefined' }, { '@language': 'fr', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        selected.should.eq('def');
      });

      it('fifth selects "und" if present', () => {
        const langMap = [{ '@language': 'und', '@value': 'undefined' }, { '@language': 'fr-FR', '@value': 'Français' }];
        const selected = utils.selectLocaleForLangMap(langMap, locale);
        selected.should.eq('und');
      });
    });

    it('finally selects first key', () => {
      const langMap = { fr: 'Français', nl: 'Nederlands' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('fr');
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

      reduced.should.eql([
        { fr: 'Français 1' },
        { fr: 'Français 2' }
      ]);
    });

    it('reduces objects for locale', () => {
      const value = { en: 'English', fr: 'Français' };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      reduced.should.eql({ fr: 'Français' });
    });

    it('preserves the translationSource', () => {
      const value = { en: 'English', fr: 'Français', translationSource: 'automated' };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      reduced.should.eql({ fr: 'Français', translationSource: 'automated' });
    });

    it('preserves entities on "def"', () => {
      const value = {
        def: [{ about: 'http://data.europeana.eu/concept/base/123' }],
        en: 'English',
        fr: 'Français'
      };

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      reduced.should.eql({
        def: [{ about: 'http://data.europeana.eu/concept/base/123' }],
        fr: 'Français'
      });
    });

    it('returns other value types untouched', () => {
      const value = 'English';

      const reduced = utils.reduceLangMapsForLocale(value, locale);

      reduced.should.eq(value);
    });
  });
});
