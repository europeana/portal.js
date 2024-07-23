// Always use HTTP adapter to prevent XHR weirdness during testing
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;

import nock from 'nock';

import oEmbed, { oEmbeddable } from '@/index.js';
import registeredProviders from '@/providers.js';

describe('oEmbed()', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  for (const provider of registeredProviders) {
    describe(`when provider is "${provider.name}"`, () => {
      const endpointUrl = new URL(provider.endpoint);

      for (const scheme of provider.schemes) {
        describe(`when scheme is ${scheme}`, () => {
          const embeddableUrl = scheme.replace(/\*/g, 'abcdef');

          const nockRequest = (embeddableUrl) => nock(endpointUrl.origin)
            .get(endpointUrl.pathname)
            .query((query) => {
              return query.url === embeddableUrl && query.format === 'json';
            });

          it('sends GET request to provider oEmbed endpoint', async() => {
            nockRequest(embeddableUrl).reply(200);

            await oEmbed(embeddableUrl);

            expect(nock.isDone()).toBe(true);
          });

          describe('when network request throws error', () => {
            it('returns `null`', async() => {
              nockRequest(embeddableUrl).replyWithError('oh no');

              const response = await oEmbed(embeddableUrl);

              expect(response).toBeNull();
            });
          });
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
