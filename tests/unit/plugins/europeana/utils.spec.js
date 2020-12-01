import * as utils from '../../../../plugins/europeana/utils';

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

    it('finally selects first key', () => {
      const langMap = { fr: 'Français', nl: 'Nederlands' };

      const selected = utils.selectLocaleForLangMap(langMap, locale);

      selected.should.eq('fr');
    });
  });
});
