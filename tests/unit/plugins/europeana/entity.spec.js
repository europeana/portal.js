import nock from 'nock';

import api, {
  getEntityQuery, getEntitySlug, getEntityUri, BASE_URL, entityParamsFromUri, isEntityUri, getWikimediaThumbnailUrl
} from '@/plugins/europeana/entity';

const entityId = '94-architecture';
const entityType = 'topic';
const entityIdMisspelled = '94-architectuz';
const apiEndpoint = '/concept/base/94.json';
const baseRequest = nock(BASE_URL).get(apiEndpoint);

const entitiesResponse = {
  items: [
    {
      type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/147831',
      prefLabel: { en: 'Architecture' },
      note: {
        en: ['Architecture is both the process and the product of planning, designing, and constructing buildings and other physical structures.']
      }
    },
    {
      type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/49928',
      prefLabel: { en: 'Painting' }
    },
    {
      type: 'Agent',
      id: 'http://data.europeana.eu/agent/base/59832',
      prefLabel: { en: 'Vincent van Gogh' },
      biographicalInformation: [
        {
          '@language': 'en',
          '@value': 'Vincent Willem van Gogh was a post-Impressionist painter of Dutch origin whose work, notable for its rough beauty, emotional honesty and bold color, had a far-reaching influence on 20th-century art. After years of painful anxiety and frequent bouts of mental illness, he died aged 37 from a gunshot wound, generally accepted to be self-inflicted (although no gun was ever found).'
        }
      ],
      isShownBy: {
        id: 'https://lh3.googleusercontent.com/Ckjq-HkB2XhEsbuMsei0MR5fLTODfkcXY8qQTG-XLHVxE0jLO9DnSYaVE8n1kCrcm9AMKzoWB2w03LrY0v7eoj5hYw=s0',
        type: 'WebResource',
        source: 'http://data.europeana.eu/item/90402/SK_A_3262',
        thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https://www.rijksmuseum.nl/assetimage2.jsp?id=SK-A-3262&type=IMAGE'
      }
    },
    {
      type: 'Timespan',
      id: 'http://data.europeana.eu/timespan/20',
      prefLabel: { en: 'Painting' }
    }
  ]
};

const entitySuggestionsResponse = {
  '@context': ['https://www.w3.org/ns/ldp.jsonld', 'http://www.europeana.eu/schemas/context/entity.jsonld'],
  type: 'ResultPage',
  total: 1,
  items: [
    {
      id: 'http://data.europeana.eu/concept/base/83',
      type: 'Concept',
      prefLabel: {
        en: 'World War I',
        sq: 'Lufta e Parë Botërore'
      }
    }
  ]
};

const conceptEntitiesResponse = {
  partOf: { total: 120 },
  items: [
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/123',
      prefLabel: { en: 'Folklore' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F627971486_640.jpg&type=VIDEO' } },
    { type: 'Concept',
      id: 'http://data.europeana.eu/concept/base/135',
      prefLabel: { en: 'Alchemy' },
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fiiif.archivelab.org%2Fiiif%2Fmiraculummundisi00glau%241%2Ffull%2Ffull%2F0%2Fdefault.jpg&type=TEXT' } }
  ]
};

describe('plugins/europeana/entity', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('get()', () => {
    describe('API response', () => {
      context('with "No resource found with ID: ..." error', () => {
        const errorMessage = 'No resource found with ID:';

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(404, {
              error: errorMessage
            });
        });

        it('throws error with API error message and status code', async() => {
          let error;
          try {
            await api().get(entityType, entityId);
          } catch (e) {
            error = e;
          }

          error.message.should.eq(errorMessage);
          error.statusCode.should.eq(404);
        });
      });

      context('with object in response', () => {
        const apiResponse = entitiesResponse.items[0];

        beforeEach('stub API response', () => {
          baseRequest
            .query(true)
            .reply(200, apiResponse);
        });

        it('returns entity title', async() => {
          const response = await api().get(entityType, entityId);
          response.entity.prefLabel.en.should.eq('Architecture');
        });

        it('returns entity description', async() => {
          const response = await api().get(entityType, entityId);
          response.entity.note.en[0].should.contain('Architecture is both the process and the product of planning');
        });

        it('has a misspelled id and returns entity title', async() => {
          const response = await api().get(entityType, entityIdMisspelled);
          response.entity.prefLabel.en.should.eq('Architecture');
        });
      });
    });
  });

  describe('find()', () => {
    const uris = ['http://data.europeana.eu/agent/base/123', 'http://data.europeana.eu/concept/base/456'];
    const uriQuery = 'entity_uri:("http://data.europeana.eu/agent/base/123" OR "http://data.europeana.eu/concept/base/456")';
    const entitySearchResponse = {
      items: []
    };
    const searchEndpoint = '/search';

    it('searches the API by entity URIs', async() => {
      nock(BASE_URL)
        .get(searchEndpoint)
        .query(query => {
          return query.query === uriQuery;
        })
        .reply(200, entitySearchResponse);

      await api().find(uris);

      nock.isDone().should.be.true;
    });
  });

  describe('suggest()', () => {
    const text = 'world';
    const suggestEndpoint = '/suggest';

    it('passes `text` to the API', async() => {
      nock(BASE_URL)
        .get(suggestEndpoint)
        .query(query => {
          return query.text === text;
        })
        .reply(200, entitySuggestionsResponse);

      await api().suggest(text);

      nock.isDone().should.be.true;
    });

    it('passes `language` to API', async() => {
      nock(BASE_URL)
        .get(suggestEndpoint)
        .query(query => {
          return query.language === 'fr';
        })
        .reply(200, entitySuggestionsResponse);

      await api().suggest(text, { language: 'fr' });

      nock.isDone().should.be.true;
    });

    it('restricts types to agent, concept & timespan', async() => {
      nock(BASE_URL)
        .get(suggestEndpoint)
        .query(query => {
          return query.type === 'agent,concept,timespan';
        })
        .reply(200, entitySuggestionsResponse);

      await api().suggest(text);

      nock.isDone().should.be.true;
    });

    it('feature-toggles inclusion of organisations', async() => {
      nock(BASE_URL)
        .get(suggestEndpoint)
        .query(query => {
          return query.type === 'agent,concept,timespan,organization';
        })
        .reply(200, entitySuggestionsResponse);
      const context = { $config: { app: { features: { organisationSearchSuggestions: true } } } };

      await api(context).suggest(text);

      nock.isDone().should.be.true;
    });

    it('returns the "items"', async() => {
      nock(BASE_URL)
        .get(suggestEndpoint)
        .query(true)
        .reply(200, entitySuggestionsResponse);

      const items = await api().suggest(text);

      items.should.deep.eq(entitySuggestionsResponse.items);
    });
  });

  describe('getEntityUri', () => {
    context('with an id of "100-test-slug"', () => {
      const id = '100-test-slug';
      context('with type Agent', () => {
        const type = 'person';
        it('returns an agent URI, with base infix, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/agent/base/100');
        });
      });

      context('with type Concept', () => {
        const type = 'topic';
        it('returns a concept URI, with base infix, without any human readable labels', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/concept/base/100');
        });
      });

      context('with type Timespan', () => {
        const type = 'time';
        it('returns a timespan URI, without any human readable labels, or base infix', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/timespan/100');
        });
      });

      context('with type Organization', () => {
        const type = 'organisation';
        it('returns an organization URI, without any human readable labels, or base infix', () => {
          const uri = getEntityUri(type, id);
          return uri.should.eq('http://data.europeana.eu/organization/100');
        });
      });
    });
  });

  describe('isEntityUri', () => {
    context('with an uri of "http://data.europeana.eu/agent/base/100"', () => {
      const uri = 'http://data.europeana.eu/agent/base/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(true);
      });
    });

    context('with an uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(true);
      });
    });

    context('with an uri of "http://data.europeana.eu/concept/base/100"', () => {
      const uri = 'http://data.europeana.eu/concept/base/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(true);
      });
    });

    context('with an uri of "http://data.europeana.eu/place/base/100"', () => {
      const uri = 'http://data.europeana.eu/place/base/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(true);
      });
    });

    context('with an uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(true);
      });
    });

    context('with an uri of "http://example.org/not-an-entity"', () => {
      const uri = 'http://example.org/not-an-entity';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        ret.should.eq(false);
      });
    });
  });

  describe('entityParamsFromUri', () => {
    context('with an agent uri of "http://data.europeana.eu/agent/base/100"', () => {
      const uri = 'http://data.europeana.eu/agent/base/100';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        params.id.should.eq('100');
        params.type.should.eq('person');
      });
    });

    context('with a timespan uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        params.id.should.eq('20');
        params.type.should.eq('time');
      });
    });

    context('with an organisation uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        params.id.should.eq('999');
        params.type.should.eq('organisation');
      });
    });
  });

  describe('getEntityQuery', () => {
    context('when entity is a concept', () => {
      const uri = 'http://data.europeana.eu/concept/base/12345';
      it('queries on skos_concept', () => {
        getEntityQuery(uri).should.eq(`skos_concept:"${uri}"`);
      });
    });

    context('when entity is an agent', () => {
      const uri = 'http://data.europeana.eu/agent/base/12345';
      it('queries on edm_agent', () => {
        getEntityQuery(uri).should.eq(`edm_agent:"${uri}"`);
      });
    });

    context('when entity is a timespan', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('queries on edm_timespan', () => {
        getEntityQuery(uri).should.eq(`edm_timespan:"${uri}"`);
      });
    });

    context('when entity is an organization', () => {
      const uri = 'http://data.europeana.eu/organization/12345';
      it('queries on foaf_organization', () => {
        getEntityQuery(uri).should.eq(`foaf_organization:"${uri}"`);
      });
    });

    context('otherwise', () => {
      const uri = 'http://data.europeana.eu/place/base/12345';
      it('throws an error', () => {
        (() => getEntityQuery(uri) === null).should.throw(`Unsupported entity URI "${uri}"`);
      });
    });
  });

  describe('getEntitySlug', () => {
    const entity = entitiesResponse.items[0];

    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = getEntitySlug(entity.id, entity.prefLabel.en);
      return slug.should.eq('147831-architecture');
    });
  });

  describe('getWikimediaThumbnailUrl', () => {
    const logo = 'http://commons.wikimedia.org/wiki/Special:FilePath/Uni-Leiden-seal.png';

    it('returns an wikimedia thumbnail url starting with https://upload.wikimedia.org', () => {
      const thumbnail = getWikimediaThumbnailUrl(logo, 60);
      return thumbnail.should.contain('https://upload.wikimedia.org');
    });
  });

  describe('search()', () => {
    beforeEach('stub API response', () => {
      nock(BASE_URL)
        .get('/search')
        .query(true)
        .reply(200, conceptEntitiesResponse);
    });

    context('with a Concept entity', () => {
      const eParams = {
        query: '*:*',
        page: 1,
        type: 'topic',
        pageSize: 2,
        scope: 'europeana'
      };

      it('returns a list of concept entities', async() => {
        const response = await api().search(eParams, 'topic');
        response.entities.length.should.eq(conceptEntitiesResponse.items.length);
      });

      it('returns the total number of entities', async() => {
        const response = await api().search(eParams, 'topic');
        response.total.should.eq(conceptEntitiesResponse.partOf.total);
      });

      it('returns a thumbnail for each entity', async() => {
        const response = await api().search(eParams, 'topic');
        response.entities[0].isShownBy.thumbnail.should.eq(conceptEntitiesResponse.items[0].isShownBy.thumbnail);
      });
    });
  });
});
