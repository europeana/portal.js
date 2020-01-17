// Static page redirects

import escapeRegExp from 'lodash/escapeRegExp';

const redirects = {
  '/collections/world-war-I': { path: '/entity/topic/83-1914-1918' },
  '/collections/archaeology': { path: '/entity/topic/80-archaeology' },
  '/collections/art': { path: '/entity/topic/190-art' },
  '/collections/fashion': { path: '/search', query: { query: '', theme: 'fashion' } },
  '/collections/industrial-heritage': { path: '/entity/topic/129-industrial-heritage' },
  '/collections/manuscripts': { path: '/entity/topic/17-manuscripts' },
  '/collections/maps': { path: '/entity/topic/151-maps-and-geography' },
  '/collections/migration': { path: '/entity/topic/128-migration' },
  '/collections/music': { path: '/entity/topic/62-music' },
  '/collections/natural-history': { path: '/entity/topic/156-natural-history' },
  '/collections/newspapers': { path: '/entity/topic/18-newspaper' },
  '/collections/photography': { path: '/entity/topic/48-photography' },
  '/collections/sport': { path: '/entity/topic/114-sport' }
};

export default (route) => {
  for (const redirectFrom in redirects) {
    const pattern = new RegExp(`^(/[a-z]{2})?${escapeRegExp(redirectFrom)}$`);
    const match = route.path.match(pattern);

    if (match) return {
      path: [
        match[1],
        redirects[redirectFrom].path
      ],
      query: redirects[redirectFrom].query
    };
  }
  return null;
};
