// Static page redirects

import escapeRegExp from 'lodash/escapeRegExp';

const redirects = {
  '/about': '/about-us',
  '/collections/archaeology': '/entity/topic/80-archaeology',
  '/collections/art': '/entity/topic/190-art',
  '/collections/fashion': { path: '/search', query: { query: '', theme: 'fashion' } },
  '/collections/industrial-heritage': '/entity/topic/129-industrial-heritage',
  '/collections/manuscripts': '/entity/topic/17-manuscripts',
  '/collections/maps': '/entity/topic/151-maps-and-geography',
  '/collections/migration': '/entity/topic/128-migration',
  '/collections/migration/collection-days-stories': '/migration/explore-migration-stories-from-events-in-these-cities',
  '/collections/migration/collection-days': '/europeana-migration-collection-days',
  '/collections/migration/explore-migration-stories': '/entity/topic/128-migration',
  '/collections/music': '/entity/topic/62-music',
  '/collections/natural-history': '/entity/topic/156-natural-history',
  '/collections/newspapers': '/entity/topic/18-newspaper',
  '/collections/newspapers/a-z-all': '/entity/topic/18-newspapers',
  '/collections/newspapers/newspapers-help-guides': '/entity/topic/18-newspapers',
  '/collections/photography': '/entity/topic/48-photography',
  '/collections/sport': '/entity/topic/114-sport',
  '/collections/world-war-I': '/entity/topic/83-1914-1918',
  '/contact': '/contact-us',
  '/exhibitions/foyer': '/exhibitions',
  '/explore/galleries': '/galleries',
  '/rights/accessibility': '/rights/accessibility-policy',
  '/rights/api': '/rights/api-terms-of-use',
  '/rights/contributions': '/rights/terms-for-user-contributions',
  '/rights/data-sources': '/rights/europeana-data-sources',
  '/rights/language': '/rights/language-policy',
  '/rights/metadata': '/rights/usage-guidelines-for-metadata',
  '/rights/privacy': '/rights/privacy-policy',
  '/rights/public-domain': '/rights/public-domain-usage-guidelines',
  '/rights/terms': '/rights/terms-of-use'
};

export default (route) => {
  for (const redirectFrom in redirects) {
    const redirectTo = typeof redirects[redirectFrom] === 'string' ? { path: redirects[redirectFrom] } : redirects[redirectFrom];

    const pattern = new RegExp(`^/portal(/[a-z]{2})?${escapeRegExp(redirectFrom)}(.html)?$`);
    const match = route.path.match(pattern);

    if (match) return {
      path: [
        match[1],
        redirectTo.path
      ],
      query: redirectTo.query
    };
  }
  return null;
};
