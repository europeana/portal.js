import md5 from 'md5';
import EuropeanaMediaProxyApi from '@/mediaProxy.js';

describe('@/mediaProxy.js', () => {
  describe('EuropeanaMediaProxyApi', () => {
    describe('url', () => {
      const europeanaId = '/123/abc';
      const mediaUrl = 'https://www.example.org/audio.ogg';

      it('uses origin https://proxy.europeana.eu', () => {
        const proxyUrl = new URL((new EuropeanaMediaProxyApi).url(mediaUrl, europeanaId));

        expect(proxyUrl.origin).toBe('https://proxy.europeana.eu');
      });

      it('uses europeanaId & web resource hash as path', () => {
        const proxyUrl = new URL((new EuropeanaMediaProxyApi).url(mediaUrl, europeanaId));

        expect(proxyUrl.pathname).toBe(`/media${europeanaId}/${md5(mediaUrl)}`);
      });

      it('sets additional params from final arg', () => {
        const proxyUrl = new URL((new EuropeanaMediaProxyApi).url(mediaUrl, europeanaId, { disposition: 'inline' }));

        expect(proxyUrl.searchParams.get('disposition')).toBe('inline');
      });
    });
  });
});
