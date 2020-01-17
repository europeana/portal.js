import qs from 'qs';
import sinon from 'sinon';

import middleware from '../../../middleware/legacy';

const rules = [
  { from: '/portal/en/about-us', to: '/en/about-us' },
  { from: '/de/record/90402/SK_A_2344.html', to: '/de/record/90402/SK_A_2344' },
  { from: '/fr/explore/people/60404-johannes-vermeer.html', to: '/fr/entity/person/60404' },
  { from: '/nl/explore/topics/47-painting.html', to: '/nl/entity/topic/47' },
  { from: '/en/collections/world-war-I', to: '/en/entity/topic/83-1914-1918' },
  { from: '/en/collections/archaeology', to: '/en/entity/topic/80-archaeology' },
  { from: '/en/collections/art', to: '/en/entity/topic/190-art' },
  { from: '/en/collections/fashion', to: '/en/search?query=&theme=fashion' },
  { from: '/en/collections/industrial-heritage', to: '/en/entity/topic/129-industrial-heritage' },
  { from: '/en/collections/manuscripts', to: '/en/entity/topic/17-manuscripts' },
  { from: '/en/collections/maps', to: '/en/entity/topic/151-maps-and-geography' },
  { from: '/en/collections/migration', to: '/en/entity/topic/128-migration' },
  { from: '/en/collections/music', to: '/en/entity/topic/62-music' },
  { from: '/en/collections/natural-history', to: '/en/entity/topic/156-natural-history' },
  { from: '/en/collections/newspapers', to: '/en/entity/topic/18-newspaper' },
  { from: '/en/collections/photography', to: '/en/entity/topic/48-photography' },
  { from: '/en/collections/sport', to: '/en/entity/topic/114-sport' },
  { from: '/portal/en/search?q=fish', to: '/en/search?query=fish' },
  { from: '/portal/en/search?q=fish&view=list', to: '/en/search?query=fish&view=list' },
  { from: '/portal/en/search?f%5BTYPE%5D%5B%5D=TEXT&f%5BTYPE%5D%5B%5D=IMAGE', to: '/en/search?query=&qf=TYPE%3A"TEXT"&qf=TYPE%3A"IMAGE"' },
  { from: '/portal/en/search?f%5BREUSABILITY%5D%5B%5D=open', to: '/en/search?query=&reusability=open' },
  { from: '/portal/en/search?f%5BREUSABILITY%5D%5B%5D=open&f%5BREUSABILITY%5D%5B%5D=restricted', to: '/en/search?query=&reusability=open,restricted' },
  { from: '/portal/en/search?f%5Bapi%5D%5B%5D=default', to: '/en/search?query=&api=metadata' },
  { from: '/portal/en/search?f%5Bapi%5D%5B%5D=api', to: '/en/search?query=&api=fulltext' },
  { from: '/portal/en/search?qf%5B%5D=whale&qf%5B%5D=haunted', to: '/en/search?query=&qf=whale&qf=haunted' },
  { from: '/portal/en/collections/art?q=paint', to: '/en/search?query=paint&theme=art' }
];

describe('middleware/legacy', () => {
  for (const rule of rules) {
    it(`redirects ${rule.from} to ${rule.to}`, () => {
      const redirect = sinon.spy();

      const fromPath = rule.from.split('?')[0];
      const fromQuery = qs.parse(rule.from.split('?')[1], { depth: 0 });

      middleware({
        redirect,
        route: {
          path: fromPath
        },
        query: fromQuery || {}
      });

      const toPath = rule.to.split('?')[0];
      const toQuery = qs.parse(rule.to.split('?')[1], { depth: 0 });

      if (Object.keys(toQuery).length > 0) {
        redirect.should.have.been.calledWith(toPath, toQuery);
      } else {
        redirect.should.have.been.calledWith(toPath);
      }
    });
  }
});
