import legacyUrl from '../../../../plugins/europeana/legacy-search';

describe('plugins/europeana/legacy-search', () => {
  describe('legacyUrl()', () => {
    context('for a blank search', () => {
      const searchParams = { query: '' };
      it('redirects to the classic portal', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/search?q=');
      });
    });

    context('for a simple search', () => {
      const searchParams = { query: 'test' };
      it('redirects to the classic portal', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/search?q=test');
      });
    });

    context('for a search with facets', () => {
      const searchParams = { query: '', qf: ['COUNTRY%3A"Germany"', 'TYPE%3A"IMAGE"', 'TYPE%3A"TEXT"'] };
      it('redirects to the classic portal reformatting the params', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/search?q=&f[COUNTRY][]="Germany"&f[TYPE][]="IMAGE"&f[TYPE][]="TEXT"');
      });
    });

    context('for a search with a reusability facet', () => {
      const searchParams = { query: '', reusability: 'open' };
      it('redirects to the classic portal reformatting the params', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/search?q=&f[REUSABILITY][]=open');
      });
    });

    context('for blank search within a collection', () => {
      const searchParams = { query: '', qf: ['collection%3Aww1'] };
      it('returns the classic portal URL for the collection search', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/collections/world-war-I?q=');
      });
    });

    context('for a simple search within a collection', () => {
      const searchParams = { query: 'test', qf: ['collection%3Aww1'] };
      it('returns the classic portal URL for the collection search', () => {
        const redirectUrl = legacyUrl(searchParams);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/collections/world-war-I?q=test');
      });
    });
  });
});
