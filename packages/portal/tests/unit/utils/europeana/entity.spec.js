import {
  getEntityQuery,
  isEntityUri,
  getEntityUri,
  entityParamsFromUri
} from '@/utils/europeana/entity.js';

describe('@utils/europeana/entity.js', () => {
  describe('getEntityQuery', () => {
    describe('when entity is a concept', () => {
      const uri = 'http://data.europeana.eu/concept/12345';
      it('queries on skos_concept', () => {
        expect(getEntityQuery(uri)).toBe(`skos_concept:"${uri}"`);
      });
    });

    describe('when entity is an agent', () => {
      const uri = 'http://data.europeana.eu/agent/12345';
      it('queries on edm_agent', () => {
        expect(getEntityQuery(uri)).toBe(`edm_agent:"${uri}"`);
      });
    });

    describe('when entity is a timespan', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('queries on edm_timespan', () => {
        expect(getEntityQuery(uri)).toBe(`edm_timespan:"${uri}"`);
      });
    });

    describe('when entity is an organization', () => {
      const uri = 'http://data.europeana.eu/organization/12345';
      it('queries on foaf_organization', () => {
        expect(getEntityQuery(uri)).toBe(`foaf_organization:"${uri}"`);
      });
    });

    describe('when entity is a place', () => {
      const uri = 'http://data.europeana.eu/place/12345';
      it('queries on edm_place', () => {
        expect(getEntityQuery(uri)).toBe(`edm_place:"${uri}"`);
      });
    });

    describe('when multiple entity URIs supplied', () => {
      const uris = ['http://data.europeana.eu/organization/12345', 'http://data.europeana.eu/organization/67890', 'https://www.example.org/404'];
      it('queries on all Europeana entities, joined with OR', () => {
        expect(getEntityQuery(uris)).toBe('foaf_organization:"http://data.europeana.eu/organization/12345" OR foaf_organization:"http://data.europeana.eu/organization/67890"');
      });
    });

    describe('otherwise', () => {
      const uri = 'http://data.europeana.eu/item/12345';
      it('throws an error', () => {
        expect(() => getEntityQuery(uri) === null).toThrow(`Unsupported entity URI "${uri}"`);
      });
    });
  });

  describe('isEntityUri', () => {
    describe('with an uri of "http://data.europeana.eu/agent/100"', () => {
      const uri = 'http://data.europeana.eu/agent/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/concept/100"', () => {
      const uri = 'http://data.europeana.eu/concept/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/place/100"', () => {
      const uri = 'http://data.europeana.eu/place/100';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(true);
      });
    });

    describe('with an uri of "http://example.org/not-an-entity"', () => {
      const uri = 'http://example.org/not-an-entity';
      it('returns true', () => {
        const ret = isEntityUri(uri);
        expect(ret).toBe(false);
      });
    });
  });

  describe('entityParamsFromUri', () => {
    describe('with an agent uri of "http://data.europeana.eu/agent/100"', () => {
      const uri = 'http://data.europeana.eu/agent/100';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('100');
        expect(params.type).toBe('person');
      });
    });

    describe('with a timespan uri of "http://data.europeana.eu/timespan/20"', () => {
      const uri = 'http://data.europeana.eu/timespan/20';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('20');
        expect(params.type).toBe('time');
      });
    });

    describe('with an organisation uri of "http://data.europeana.eu/organization/999"', () => {
      const uri = 'http://data.europeana.eu/organization/999';
      it('returns the id and type', () => {
        const params = entityParamsFromUri(uri);
        expect(params.id).toBe('999');
        expect(params.type).toBe('organisation');
      });
    });
  });

  describe('getEntityUri', () => {
    describe('with an id of "100-test-slug"', () => {
      const id = '100-test-slug';
      describe('with type Agent', () => {
        const type = 'person';
        it('returns an agent URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/agent/100');
        });
      });

      describe('with type Concept', () => {
        const type = 'topic';
        it('returns a concept URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/concept/100');
        });
      });

      describe('with type Timespan', () => {
        const type = 'time';
        it('returns a timespan URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/timespan/100');
        });
      });

      describe('with type Organization', () => {
        const type = 'organisation';
        it('returns an organization URI, without any human readable labels, nor base infix', () => {
          const uri = getEntityUri(type, id);
          expect(uri).toBe('http://data.europeana.eu/organization/100');
        });
      });
    });
  });
});
