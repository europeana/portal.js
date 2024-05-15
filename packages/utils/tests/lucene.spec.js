import { escapeLuceneSpecials, unescapeLuceneSpecials } from '@/lucene.js';

describe('@europeana/utils/lucene.js', () => {
  describe('escapeLuceneSpecials', () => {
    it('escapes Lucene special characters', () => {
      const unescaped = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : /';

      const escaped = escapeLuceneSpecials(unescaped);

      expect(escaped).toBe('\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/');
    });
  });

  describe('unescapeLuceneSpecials', () => {
    it('unescapes Lucene special characters', () => {
      const escaped = '\\+ \\- \\& \\| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\/';

      const unescaped = unescapeLuceneSpecials(escaped);

      expect(unescaped).toBe('+ - & | ! ( ) { } [ ] ^ " ~ * ? : /');
    });
  });
});
