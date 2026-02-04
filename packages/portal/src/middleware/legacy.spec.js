import qs from 'qs';
import sinon from 'sinon';

import middleware from '@/middleware/legacy';

const rules = [
  { from: '/fr/portal', to: '/fr', status: 301 },
  { from: '/en/portal/about', to: '/en/about', status: 301 },
  { from: '/portal/en/about-us', to: '/en/about-us' },
  { from: '/portal/en/explore/colours.html', to: '/en/collections', status: 302 },
  { from: '/portal/en/explore/periods.html', to: '/en/collections', status: 302 },
  { from: '/portal/en/explore/people.html', to: '/en/collections', status: 302 },
  { from: '/portal/en/explore/topics.html', to: '/en/collections', status: 302 },
  { from: '/portal/en/explore/sources.html', to: '/en/collections', status: 302 },
  { from: '/portal/en/explore/newcontent.html', to: '/en/collections', status: 302 },
  { from: '/portal/de/record/90402/SK_A_2344.html', to: '/de/item/90402/SK_A_2344' },
  { from: '/portal/fr/explore/people/60404-johannes-vermeer.html', to: '/fr/collections/person/60404' },
  { from: '/portal/nl/explore/topics/47-painting.html', to: '/nl/collections/topic/47' },
  { from: '/portal/en/collections/world-war-I', to: '/en/collections/topic/83-1914-1918' },
  { from: '/portal/en/collections/archaeology', to: '/en/collections/topic/80-archaeology' },
  { from: '/portal/en/collections/art', to: '/en/collections/topic/190-art' },
  { from: '/portal/en/collections/fashion', to: '/en/collections/topic/55-fashion' },
  { from: '/portal/en/collections/industrial-heritage', to: '/en/collections/topic/129-industrial-heritage' },
  { from: '/portal/en/collections/manuscripts', to: '/en/collections/topic/17-manuscripts' },
  { from: '/portal/en/collections/maps', to: '/en/collections/topic/151-maps-and-geography' },
  { from: '/portal/en/collections/migration', to: '/en/collections/topic/128-migration' },
  { from: '/portal/en/collections/music', to: '/en/collections/topic/62-music' },
  { from: '/portal/en/collections/natural-history', to: '/en/collections/topic/156-natural-history' },
  { from: '/portal/en/collections/newspapers', to: '/en/collections/topic/18-newspaper' },
  { from: '/portal/en/collections/photography', to: '/en/collections/topic/48-photography' },
  { from: '/portal/en/collections/sport', to: '/en/collections/topic/114-sport' },
  { from: '/portal/en/search?q=fish', to: '/en/search?query=fish' },
  { from: '/portal/en/search?q=fish&page=2', to: '/en/search?query=fish' },
  { from: '/portal/en/search?q=fish&per_page=24', to: '/en/search?query=fish' },
  { from: '/portal/en/search?q=fish&view=list', to: '/en/search?query=fish&view=list' },
  { from: '/en/portal/en/search?q=fish', to: '/en/search?query=fish' },
  // { from: '/en/portal/en/search?q=fish&page=2', to: '/en/search?query=fish' },
  // { from: '/en/portal/en/search?q=fish&per_page=24', to: '/en/search?query=fish' },
  // { from: '/en/portal/en/search?q=fish&view=list', to: '/en/search?query=fish&view=list' },
  {
    from: '/portal/en/search?f%5BTYPE%5D%5B%5D=TEXT&f%5BTYPE%5D%5B%5D=IMAGE',
    to: '/en/search?query=&qf=TYPE%3A"TEXT"&qf=TYPE%3A"IMAGE"'
  },
  { from: '/portal/en/search?f%5BREUSABILITY%5D%5B%5D=open', to: '/en/search?query=&reusability=open' },
  {
    from: '/portal/en/search?f%5BREUSABILITY%5D%5B%5D=open&f%5BREUSABILITY%5D%5B%5D=restricted',
    to: '/en/search?query=&reusability=open,restricted'
  },
  { from: '/portal/en/search?f%5Bapi%5D%5B%5D=default', to: '/en/search?query=&api=metadata' },
  { from: '/portal/en/search?f%5Bapi%5D%5B%5D=api', to: '/en/search?query=&api=fulltext' },
  { from: '/portal/en/search?q=fish&query=hook', to: '/en/search?query=fish+AND+hook' },
  { from: '/portal/en/search?q=whale&qf%5B%5D=NOT+tooth', to: '/en/search?query=whale+AND+NOT+tooth' },
  { from: '/portal/en/collections/art?q=paint', to: '/en/search?query=paint&qf=collection%3Aart' },
  {
    from: '/portal/en/collections/newspapers?q=&range%5Bproxy_dcterms_issued%5D%5Bbegin%5D=1900-01-01&range%5Bproxy_dcterms_issued%5D%5Bend%5D=1910-01-01',
    to: '/en/search?query=&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A%5B1900-01-01+TO+1910-01-01%5D'
  },
  {
    from: '/portal/en/collections/newspapers?q=&range%5Bproxy_dcterms_issued%5D%5Bbegin%5D=&range%5Bproxy_dcterms_issued%5D%5Bend%5D=1910-01-01',
    to: '/en/search?query=&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A%5B%2A+TO+1910-01-01%5D'
  },
  {
    from: '/portal/en/collections/newspapers?q=&range%5Bproxy_dcterms_issued%5D%5Bbegin%5D=1900-01-01&range%5Bproxy_dcterms_issued%5D%5Bend%5D=',
    to: '/en/search?query=&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A%5B1900-01-01+TO+%2A%5D'
  },
  {
    from: '/portal/en/collections/newspapers?q=&range%5Bproxy_dcterms_issued%5D%5Bbegin%5D=1900-01-01&range%5Bproxy_dcterms_issued%5D%5Bend%5D=1900-01-01',
    to: '/en/search?query=&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A1900-01-01'
  },
  {
    from: '/portal/en/search?q=&f%5BRIGHTS%5D%5B%5D=http%2A%3A%2F%2Fcreativecommons.org%2Flicenses%2Fby-nc-sa%2A',
    to: '/en/search?query=&qf=RIGHTS%3Ahttp%2A%3A%2F%2Fcreativecommons.org%2Flicenses%2Fby-nc-sa%2A'
  },
  {
    from: '/portal/en/search?q=&f%5BDATA_PROVIDER%5D%5B%5D=Nederlands+Bakkerijmuseum+%22Het+Warme+Land%22',
    to: '/en/search?query=&qf=DATA_PROVIDER%3A%22Nederlands+Bakkerijmuseum+%5C%22Het+Warme+Land%5C%22%22'
  },
  { from: '/portal/en/exhibitions/foyer', to: '/en/exhibitions' },
  { from: '/portal/es/exhibitions/heritage-at-risk', to: '/es/exhibitions/heritage-at-risk' },
  { from: '/portal/de/explore/galleries', to: '/de/galleries' },
  { from: '/portal/pl/explore/galleries/board-games', to: '/pl/galleries/board-games' }
];

describe('middleware/legacy', () => {
  it('does not redirect without "/portal" at start of URL', () => {
    const redirect = sinon.spy();

    middleware({
      redirect,
      route: {
        path: '/fr',
        fullPath: '/fr'
      },
      query: {},
      app: {}
    });

    expect(redirect.called).toBe(false);
  });

  for (const rule of rules) {
    it(`redirects ${rule.from} to ${rule.to}`, () => {
      const redirect = sinon.spy();

      const fromPath = rule.from.split('?')[0];
      const fromQuery = qs.parse(rule.from.split('?')[1], { depth: 0 });

      middleware({
        redirect,
        route: {
          path: fromPath,
          fullPath: rule.from
        },
        query: fromQuery || {},
        app: {}
      });

      const toPath = rule.to.split('?')[0];
      const toQuery = qs.parse(rule.to.split('?')[1], { depth: 0 });
      const status = rule.status || 301;

      expect(redirect.calledWith(status, { path: toPath, query: toQuery })).toBe(true);
    });
  }
});
