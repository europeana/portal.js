import nock from 'nock';
import oEmbed, { oEmbeddable } from '../../../plugins/oembed';
import supportedProviders from '../../../plugins/oembed/providers';

describe('oEmbed()', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  for (const provider of supportedProviders) {
    context(`when provider is "${provider.name}"`, () => {
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

        it('sends GET request to provider oEmbed endpoint', async() => {
          nockRequest(embeddableUrl);

          await oEmbed(embeddableUrl);

          nock.isDone().should.be.true;
        });

        it('returns a promise', () => {
          nockRequest(embeddableUrl);

          const response = oEmbed(embeddableUrl);

          response.should.be.fulfilled;
        });
      }
    });
  }
});

describe('oEmbeddable()', () => {
  for (const provider of supportedProviders) {
    context(`when provider is "${provider.name}"`, () => {
      for (const scheme of provider.schemes) {
        it(`is \`true\` for scheme "${scheme}"`, () => {
          const embeddableUrl = scheme.replace(/\*/g, 'abcdef');
          oEmbeddable(embeddableUrl).should.be.true;
        });
      }
    });
  }

  it('is `false` for unsupported providers', () => {
    const unsupportedembeddableUrl = 'https://www.example.com/watch?v=abcdef';
    oEmbeddable(unsupportedembeddableUrl).should.be.false;
  });
});
