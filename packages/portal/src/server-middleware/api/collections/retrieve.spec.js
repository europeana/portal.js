import nock from 'nock';
import sinon from 'sinon';
import cloneDeep from 'lodash/cloneDeep.js';

import serverMiddleware, { fetchData } from './retrieve.js';

describe('server-middleware/api/collections/retrieve.js', () => {
  const entities = [
    {
      id: 'http://data.europeana.eu/organization/1',
      type: 'Aggregator',
      prefLabel: { en: 'One', nl: 'Een' }
    },
    {
      id: 'http://data.europeana.eu/organization/2',
      type: 'Organization',
      prefLabel: { en: 'Two', nl: 'Twee' }
    }
  ];
  const ids = [
    'http://data.europeana.eu/organization/1',
    'http://data.europeana.eu/organization/2'
  ];
  const context = { $apis: { entity: { retrieve: sinon.stub() } } };

  beforeAll(() => {
    nock.disableNetConnect();
  });
  beforeEach(() => {
    context.$apis.entity.retrieve.withArgs(ids).resolves(cloneDeep(entities));
  });
  afterEach(() => {
    sinon.resetHistory();
  });
  afterAll(() => {
    nock.enableNetConnect();
    sinon.restore();
  });

  describe('default export (middleware)', () => {
    const req = { body: ids, query: {} };
    const resStub = {
      json: sinon.stub()
    };
    const nextStub = sinon.stub().callsFake((err) => {
      if (err instanceof Error) {
        throw err;
      }
    });

    it('retrieves from the Entity API, with IDs from request body', async() => {
      await serverMiddleware(context)(req, resStub, nextStub);

      expect(context.$apis.entity.retrieve.calledWith(ids)).toBe(true);
    });

    it('responds with JSON', async() => {
      await serverMiddleware(context)(req, resStub, nextStub);

      expect(resStub.json.called).toBe(true);
    });
  });

  describe('fetchData', () => {
    it('retrieves from the Entity API client, with IDs from ids prop', async() => {
      await fetchData(ids, {}, context);

      expect(context.$apis.entity.retrieve.calledWith(ids)).toBe(true);
    });

    it('returns the items from the API client', async() => {
      const response = await fetchData(ids, {}, context);

      expect(response).toEqual(entities);
    });

    describe('picking fields to include from fields prop', () => {
      it('picks single top-level field', async() => {
        const fields = 'id';
        const expected = [{ id: entities[0].id }, { id: entities[1].id }];

        const response = await fetchData(ids, { fields }, context);

        expect(response).toEqual(expected);
      });

      it('picks multiple top-level fields', async() => {
        const fields = ['id', 'prefLabel'];
        const expected = [
          { id: entities[0].id, prefLabel: entities[0].prefLabel },
          { id: entities[1].id, prefLabel: entities[1].prefLabel }
        ];

        const response = await fetchData(ids, { fields }, context);

        expect(response).toEqual(expected);
      });
    });

    describe('localising LangMap values from lang prop', () => {
      it('reduces all LangMap fields to the specified language', async() => {
        const lang = 'nl';
        const expected = [
          { ...entities[0], prefLabel: { nl: entities[0].prefLabel.nl } },
          { ...entities[1], prefLabel: { nl: entities[1].prefLabel.nl } }
        ];

        const response = await fetchData(ids, { lang }, context);

        expect(response).toEqual(expected);
      });

      it('falls back to English default if specified language unavailable', async() => {
        const lang = 'fr';
        const expected = [
          { ...entities[0], prefLabel: { en: entities[0].prefLabel.en } },
          { ...entities[1], prefLabel: { en: entities[1].prefLabel.en } }
        ];

        const response = await fetchData(ids, { lang }, context);

        expect(response).toEqual(expected);
      });
    });
  });
});
