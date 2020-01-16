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
  { from: '/en/collections/sport', to: '/en/entity/topic/114-sport' }
];

describe('middleware/legacy', () => {
  for (const rule of rules) {
    it(`redirects ${rule.from} to ${rule.to}`, () => {
      const redirect = sinon.spy();

      middleware({
        redirect,
        route: {
          path: rule.from
        }
      });

      redirect.should.have.been.calledWith({
        path: rule.to
      });
    });
  }
});
