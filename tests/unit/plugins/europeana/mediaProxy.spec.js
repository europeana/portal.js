import mediaProxy from '../../../../plugins/europeana/mediaProxy';

describe('plugins/europeana/mediaProxy', () => {
  describe('url()', () => {
    const europeanaId = '/123/abc';
    const mediaUrl = 'https://www.example.org/audio.ogg';

    it('uses origin https://proxy.europeana.eu', () => {
      const proxyUrl = new URL(mediaProxy().url(mediaUrl, europeanaId));

      proxyUrl.origin.should.eq('https://proxy.europeana.eu');
    });

    it('uses europeanaId as path', () => {
      const proxyUrl = new URL(mediaProxy().url(mediaUrl, europeanaId));

      proxyUrl.pathname.should.eq(europeanaId);
    });

    it('uses web resource URI as view param', () => {
      const proxyUrl = new URL(mediaProxy().url(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('view').should.eq(mediaUrl);
    });

    it('uses store Record API origin as api_url param', () => {
      const proxyUrl = new URL(mediaProxy().url(mediaUrl, europeanaId));

      proxyUrl.searchParams.get('api_url').should.eq('https://api.europeana.eu/api');
    });

    it('sets additional params from final arg', () => {
      const proxyUrl = new URL(mediaProxy().url(mediaUrl, europeanaId, { disposition: 'inline' }));

      proxyUrl.searchParams.get('disposition').should.eq('inline');
    });
  });
});
