// import nock from 'nock';
import { oEmbeddable } from '../../../plugins/oembed.js';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('oembed()', () => {
  it('sends GET request to provider oEmbed endpoint');
  it('returns a promise');
});

describe('oembeddable()', () => {
  const supportedMediaSources = [
    { provider: 'SoundCloud', url: 'https://soundcloud.com/abc/def' },
    { provider: 'Vimeo', url: 'https://vimeo.com/abcdef' },
    { provider: 'EUscreen', url: 'http://www.euscreen.eu/item.html?id=abcdef' },
    { provider: 'CREM-CNRS', url: 'http://archives.crem-cnrs.fr/archives/items/abcdef/' },
    { provider: 'CCMA', url: 'http://www.ccma.cat/tv3/alacarta/programa/titol/video/abcdef/' },
    { provider: 'Ina.fr (short)', url: 'http://www.ina.fr/video/abcdef' },
    { provider: 'Ina.fr (long)', url: 'http://www.ina.fr/category/subcategory/video/abcdef/title.fr.html#xtor=AL-3' },
    { provider: 'PicturePipe (http)', url: 'http://api.picturepipe.net/api/html/widgets/public/playout_cloudfront?token=abcdef' },
    { provider: 'PicturePipe (https)', url: 'https://api.picturepipe.net/api/html/widgets/public/playout_cloudfront?token=abcdef' },
    { provider: 'TEL', url: 'http://www.theeuropeanlibrary.org/tel4/newspapers/issue/fullscreen/abcdef' }
    // TODO: add other supported providers
  ];

  for (const source of supportedMediaSources) {
    it(`is \`true\` for ${source.provider} provider`, () => {
      oEmbeddable(source.url).should.be.true;
    });
  }

  it('is `false` for unsupported providers', () => {
    const unsupportedMediaUrl = 'https://www.youtube.com/watch?v=abcdef';
    oEmbeddable(unsupportedMediaUrl).should.be.false;
  });
});
