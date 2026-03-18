import * as utils from '@/plugins/europeana/utils';
import sinon from 'sinon';

describe('plugins/europeana/utils', () => {
  describe('escapeLuceneSpecials', () => {
    it('escapes Lucene special characters', () => {
      const unescaped = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : /';

      const escaped = utils.escapeLuceneSpecials(unescaped);

      expect(escaped).toBe('\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/');
    });
  });

  describe('unescapeLuceneSpecials', () => {
    it('unescapes Lucene special characters', () => {
      const escaped = '\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/';

      const unescaped = utils.unescapeLuceneSpecials(escaped);

      expect(unescaped).toBe('+ - & | ! ( ) { } [ ] ^ " ~ * ? : /');
    });
  });

  describe('getLabelledSlug', () => {
    it('constructs URL slug from numeric ID and prefLabel.en', () => {
      const slug = utils.getLabelledSlug('http://data.euroepana.eu/concept/147831', 'Architecture');
      expect(slug).toBe('147831-architecture');
    });
  });

  describe('daily', () => {
    it('returns as-is any non-Array argument', () => {
      const argument = 'not an Array';

      const filtered = utils.daily(argument, 4);

      expect(filtered).toBe(argument);
    });

    it('filters Array arguments to requested number for the current day', () => {
      const argument = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const tests = [
        { now: 0, expected: [0, 1, 2, 3] },
        { now: 1634556628480, expected: [3, 4, 5, 6] }
      ];

      for (const test of tests) {
        sinon.stub(Date, 'now').returns(test.now);
        const filtered = utils.daily(argument, 4);
        expect(filtered).toEqual(test.expected);
        Date.now.restore();
      }
    });
  });
});
