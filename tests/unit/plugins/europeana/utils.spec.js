import * as utils from '../../../../plugins/europeana/utils';

describe('plugins/europeana/utils', () => {
  describe('thumbnailUrl()', () => {
    const uri = 'https://www.example.org/doc.pdf';

    it('uses the thumbnail API', () => {
      utils.thumbnailUrl(uri).should.startWith('https://api.europeana.eu/api/v2/thumbnail-by-url.json');
    });

    it('URL-encodes URI', () => {
      const encoded = 'https%3A%2F%2Fwww.example.org%2Fdoc.pdf';
      utils.thumbnailUrl(uri).should.include(`uri=${encoded}`);
    });

    it('adds any additional parameters', () => {
      const params = { size: 'w200' };
      utils.thumbnailUrl(uri, params).should.include('size=w200');
    });
  });
});
