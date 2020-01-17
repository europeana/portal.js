// Static page redirects

import escapeRegExp from 'lodash/escapeRegExp';

const redirects = {
  '/collections/world-war-I': '/entity/topic/83-1914-1918',
  '/collections/archaeology': '/entity/topic/80-archaeology',
  '/collections/art': '/entity/topic/190-art',
  '/collections/fashion': '/search?query=&theme=fashion',
  '/collections/industrial-heritage': '/entity/topic/129-industrial-heritage',
  '/collections/manuscripts': '/entity/topic/17-manuscripts',
  '/collections/maps': '/entity/topic/151-maps-and-geography',
  '/collections/migration': '/entity/topic/128-migration',
  '/collections/music': '/entity/topic/62-music',
  '/collections/natural-history': '/entity/topic/156-natural-history',
  '/collections/newspapers': '/entity/topic/18-newspaper',
  '/collections/photography': '/entity/topic/48-photography',
  '/collections/sport': '/entity/topic/114-sport'
};

export default (route) => {
  for (const redirectFrom in redirects) {
    const pattern = new RegExp(`^(/[a-z]{2})?${escapeRegExp(redirectFrom)}$`);
    const match = route.path.match(pattern);

    if (match) return {
      path: [
        match[1],
        redirects[redirectFrom]
      ]
    };
  }
  return null;
};
