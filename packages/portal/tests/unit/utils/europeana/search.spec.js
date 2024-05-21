import {
  addContentTierFilter,
  rangeToQueryParam,
  rangeFromQueryParam,
  reduceFieldsForSearchResult
} from '@/utils/europeana/search.js';

describe('@utils/europeana/search.js', () => {
  describe('addContentTierFilter', () => {
    describe('with no qf', () => {
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter()).toEqual(expected);
      });
    });
    describe('with an empty array as qf', () => {
      const qf = [];
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a single non contentTier qf', () => {
      const qf = 'TYPE:"IMAGE"';
      it('returns the qf with the tier 1-4 filter applied', () => {
        const expected = ['TYPE:"IMAGE"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a contentTier qf', () => {
      const qf = 'contentTier:3';
      it('returns the qf as is', () => {
        const expected = ['contentTier:3'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with multiple qfs', () => {
      const qf = ['TYPE:"IMAGE"', 'REUSABILITY:"open"'];
      it('returns the qf with the tier filter appended', () => {
        const expected = ['TYPE:"IMAGE"', 'REUSABILITY:"open"', 'contentTier:(1 OR 2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a contentTier qf of "*"', () => {
      const qf = 'contentTier:*';
      it('returns the qf without the qf', () => {
        const expected = [];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with a collection qf', () => {
      const qf = ['collection:art'];
      it('returns the qf with the tier 2-4 filter applied', () => {
        const expected = ['collection:art', 'contentTier:(2 OR 3 OR 4)'];
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
    describe('with an foaf_organization qf', () => {
      const qf = ['foaf_organization:"http://data.europeana.eu/organization/1234567890"'];
      it('returns the qf with no content tier filter applied', () => {
        const expected = qf;
        expect(addContentTierFilter(qf)).toEqual(expected);
      });
    });
  });

  describe('rangeToQueryParam', () => {
    describe('with no start or end', () => {
      it('returns "[* TO *]"', () => {
        const expected = '[* TO *]';
        expect(rangeToQueryParam({})).toEqual(expected);
      });
    });
    describe('with only a start', () => {
      it('returns "[START TO *]"', () => {
        const expected = '[START TO *]';
        expect(rangeToQueryParam({ start: 'START' })).toEqual(expected);
      });
    });
    describe('with only an end', () => {
      it('returns "[* TO END]"', () => {
        const expected = '[* TO END]';
        expect(rangeToQueryParam({ end: 'END' })).toEqual(expected);
      });
    });
    describe('with both start and end', () => {
      it('returns "[START TO END]"', () => {
        const expected = '[START TO END]';
        expect(rangeToQueryParam({ start: 'START', end: 'END' })).toEqual(expected);
      });
    });
  });

  describe('rangeFromQueryParam', () => {
    describe('when the pattern does NOT match', () => {
      it('returns null', () => {
        expect(rangeFromQueryParam('[abc OR xyz]')).toBe(null);
      });
    });
    describe('with blank start and end values', () => {
      it('returns both values', () => {
        expect(rangeFromQueryParam('[ TO ]')).toBe(null);
      });
    });
    describe('with only a start', () => {
      it('returns null for the end', () => {
        const expected = { start: 'START', end: null };
        expect(rangeFromQueryParam('[START TO *]')).toEqual(expected);
      });
    });
    describe('with only an end', () => {
      it('returns null for the start', () => {
        const expected = { start: null, end: 'END' };
        expect(rangeFromQueryParam('[* TO END]')).toEqual(expected);
      });
    });
    describe('with both start and end', () => {
      it('returns both values', () => {
        const expected = { start: 'START', end: 'END' };
        expect(rangeFromQueryParam('[START TO END]')).toEqual(expected);
      });
    });
    describe('with special characters', () => {
      it('returns both values', () => {
        const expected = { start: '10/Новембар/2000', end: 'Value with spaces' };
        expect(rangeFromQueryParam('[10/Новембар/2000 TO Value with spaces]')).toEqual(expected);
      });
    });
    describe('with quoted values', () => {
      it('returns both values', () => {
        const expected = { start: '"START"', end: '\'END\'' };
        expect(rangeFromQueryParam('["START" TO \'END\']')).toEqual(expected);
      });
    });
  });

  describe('reduceFieldsForSearchResult', () => {
    const bloatedResponse = {
      id: '/123/abc',
      type: 'IMAGE',
      dataProvider: ['Europeana Foundation'],
      title: ['A painting', 'Een schilderij'],
      dcTitleLangAware: {
        en: ['A painting'],
        nl: ['Een schilderij']
      },
      dcDescription: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting.'],
      dcDescriptionLangAware: {
        en: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting.']
      },
      dcCreatorLangAware: {
        en: ['An artist']
      },
      edmPreview: ['https://example.org/thumbnail/123/abc.jpeg']
    };

    it('preserves required non-LangMap fields', () => {
      const item = reduceFieldsForSearchResult(bloatedResponse, 'en');

      expect(item.id).toBe('/123/abc');
      expect(item.type).toBe('IMAGE');
      expect(item.dataProvider).toEqual(['Europeana Foundation']);
      expect(item.edmPreview).toEqual(['https://example.org/thumbnail/123/abc.jpeg']);
    });

    it('removes irrelevant LangMap locales', async() => {
      const item = reduceFieldsForSearchResult(bloatedResponse, 'en');

      expect(item.dcTitleLangAware).toEqual({ en: ['A painting'] });
    });

    it('truncates long LangMap values', async() => {
      const item = reduceFieldsForSearchResult(bloatedResponse, 'en');

      expect(item.dcDescriptionLangAware).toEqual({ en: ['More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this painting. More information about this …'] });
    });

    it('removes irrelevant fields', async() => {
      const item = reduceFieldsForSearchResult(bloatedResponse, 'en');

      expect(item.title === undefined).toBe(true);
      expect(item.dcDescription === undefined).toBe(true);
    });
  });
});
