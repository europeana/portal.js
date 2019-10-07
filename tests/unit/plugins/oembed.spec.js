// import nock from 'nock';
import { oEmbeddable } from '../../../plugins/oembed.js';

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('oembed()', () => {
});

describe('oembeddable()', () => {
  const supportedMediaSources = [
    { provider: 'SoundCloud', url: 'https://soundcloud.com/abc/def' },
    { provider: 'Vimeo', url: 'https://vimeo.com/abcdef' },
    { provider: 'YouTube', url: 'https://www.youtube.com/watch?v=abcdef' }
    // TODO: add other supported providers
  ];

  for (const source of supportedMediaSources) {
    it(`is \`true\` for ${source.provider} provider`, () => {
      oEmbeddable(source.url).should.be.true;
    });
  }

  it('is `false` for unsupported providers', () => {
    const unsupportedMediaUrl = 'http://www.example.org/abcdef';
    oEmbeddable(unsupportedMediaUrl).should.be.false;
  });
});
