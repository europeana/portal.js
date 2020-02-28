import legacyUrl from '../../../../plugins/europeana/legacy-search';

describe('plugins/europeana/legacy-search', () => {
  let locale = 'en';
  describe('legacyUrl()', () => {
    context('for a blank search', () => {
      const searchParams = { query: '' };
      it('redirects to the classic portal', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/search?q=');
      });
    });

    context('for a simple search', () => {
      const searchParams = { query: 'test' };
      it('redirects to the classic portal', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/search?q=test');
      });
    });

    context('for a search with facets', () => {
      const searchParams = { query: '', qf: ['COUNTRY%3A"Germany"', 'TYPE%3A"IMAGE"', 'TYPE%3A"TEXT"'] };
      it('redirects to the classic portal reformatting the params', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/search?q=&f[COUNTRY][]="Germany"&f[TYPE][]="IMAGE"&f[TYPE][]="TEXT"');
      });
    });

    context('for a search with a reusability facet', () => {
      const searchParams = { query: '', reusability: 'open' };
      it('redirects to the classic portal reformatting the params', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/search?q=&f[REUSABILITY][]=open');
      });
    });

    context('for blank search within a collection', () => {
      const searchParams = { query: '', qf: ['collection%3Aww1'] };
      it('returns the classic portal URL for the collection search', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/world-war-I?q=');
      });
    });

    context('for a simple search within a collection', () => {
      const searchParams = { query: 'test', qf: ['collection%3Aww1'] };
      it('returns the classic portal URL for the collection search', () => {
        const redirectUrl = legacyUrl(searchParams, locale);
        redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/world-war-I?q=test');
      });
    });

    context('for the newspapers collection', () => {
      let newspaperQfParam = 'collection%3Anewspaper';
      context('for a simple a fulltext search', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam], api: 'fulltext' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&f[api][]=collection');
        });
      });

      context('for a simple a metadata search', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam], api: 'metadata' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&f[api][]=default');
        });
      });

      context('for a search filtering by a start date', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam, 'proxy_dcterms_issued%3A[1900-01-01 TO *]'], api: 'fulltext' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&range[proxy_dcterms_issued][begin]=1900-01-01&range[proxy_dcterms_issued][end]=*&f[api][]=collection');
        });
      });

      context('for a search filtering by an end date', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam, 'proxy_dcterms_issued%3A[* TO 2000-12-31]'], api: 'fulltext' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&range[proxy_dcterms_issued][begin]=*&range[proxy_dcterms_issued][end]=2000-12-31&f[api][]=collection');
        });
      });

      context('for a search filtering by start and end date', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam, 'proxy_dcterms_issued%3A[1900-01-01 TO 2000-12-31]'], api: 'fulltext' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&range[proxy_dcterms_issued][begin]=1900-01-01&range[proxy_dcterms_issued][end]=2000-12-31&f[api][]=collection');
        });
      });

      context('for a search filtering by a specific date', () => {
        const searchParams = { query: 'test', qf: [newspaperQfParam, 'proxy_dcterms_issued%3A1940-12-01'], api: 'fulltext' };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/newspapers?q=test&range[proxy_dcterms_issued][begin]=1940-12-01&range[proxy_dcterms_issued][end]=1940-12-01&f[api][]=collection');
        });
      });
    });

    context('for the fashion collection', () => {
      let fashionQfParam = 'collection%3Afashion';
      context('for a simple a fulltext search', () => {
        const searchParams = { query: 'test', qf: [fashionQfParam, 'CREATOR%3A"Chanel (Designer)"', 'CREATOR%3A"Valens (Designer)"', 'proxy_dc_format.en%3A"Technique%3A weaving techniques"', 'proxy_dc_type.en%3A"Object Type%3A ensemble"', 'proxy_dcterms_medium.en%3A"Material%3A silk"'] };
        it('returns the classic portal URL for the collection search', () => {
          const redirectUrl = legacyUrl(searchParams, locale);
          redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/fashion?q=test&f[CREATOR][]="Chanel (Designer)"&f[CREATOR][]="Valens (Designer)"&f[proxy_dc_format.en][]="Technique%3A weaving techniques"&f[proxy_dc_type.en][]="Object Type%3A ensemble"&f[proxy_dcterms_medium.en][]="Material%3A silk"');
        });
      });
    });

    context('for the migration collection', () => {
      //let migrationQfParam = 'collection%3Afashion';
      context('for a simple search only containing User generated Content', () => {
        // Pending
        // const searchParams = { query: 'test', qf: [migrationQfParam] };
        // it('returns the classic portal URL for the collection search', () => {
        //   const redirectUrl = legacyUrl(searchParams, locale);
        //   redirectUrl.should.eq('https://classic.europeana.eu/portal/en/collections/migration?q=test&&f[edm_UGC][]=true');
        // });
      });
    });
  });
});
