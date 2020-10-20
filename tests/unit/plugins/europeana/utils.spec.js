import {
  apiUrlFromRequestHeaders
} from '../../../../plugins/europeana/utils';

describe('plugins/europeana/utils', () => {
  describe('apiUrlFromRequestHeaders()', () => {
    it('returns lowercased X-Europeana-${API}-API-URL header', () => {
      const url = 'https://alternate.example.org';
      const headers = {
        'x-europeana-record-api-url': url
      };

      apiUrlFromRequestHeaders('record', headers).should.eq(url);
    });
  });
});
