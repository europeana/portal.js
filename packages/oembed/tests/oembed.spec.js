// Always use HTTP adapter to prevent XHR weirdness during testing
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;

import nock from 'nock';

import oEmbed, { oEmbeddable } from '@/index.js';
import registeredProviders from '@/providers.js';

describe('oEmbed()', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  for (const provider of registeredProviders) {
    describe(`when provider is "${provider.name}"`, () => {
      const endpointUrl = new URL(provider.endpoint);

      for (const scheme of provider.schemes) {
        const embeddableUrl = scheme.replace(/\*/g, 'abcdef');

        const nockRequest = (embeddableUrl) => {
          nock(endpointUrl.origin)
            .get(endpointUrl.pathname)
            .query(query => {
              return query.url === embeddableUrl && query.format === 'json';
            })
            .reply(200);
        };

        it(`sends GET request to provider oEmbed endpoint for ${scheme}`, async() => {
          nockRequest(embeddableUrl);

          await oEmbed(embeddableUrl);

          expect(nock.isDone()).toBe(true);
        });
      }
    });
  }
});

describe('oEmbeddable()', () => {
  for (const provider of registeredProviders) {
    describe(`when provider is "${provider.name}"`, () => {
      for (const scheme of provider.schemes) {
        it(`is \`true\` for scheme "${scheme}"`, () => {
          const embeddableUrl = scheme.replace(/\*/g, 'abcdef');
          expect(oEmbeddable(embeddableUrl)).toBe(true);
        });
      }
    });
  }

  it('is `false` for unsupported providers', () => {
    const unsupportedembeddableUrl = 'https://www.example.com/watch?v=abcdef';
    expect(oEmbeddable(unsupportedembeddableUrl)).toBe(false);
  });
});
