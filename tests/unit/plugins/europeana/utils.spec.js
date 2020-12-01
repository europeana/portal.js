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
});
