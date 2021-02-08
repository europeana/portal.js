// Static page redirects

import escapeRegExp from 'lodash/escapeRegExp';

const redirects = {
  '/about': '/about-us',
  '/accessibility': '/rights/accessibility-policy',
  '/api-api1-api2': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-changes': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-common-fields': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-data-structure': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-documentation': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-europeana-repository': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-fields': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-introduction': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-methods': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-opensearch-rss': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-profile-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-query-syntax': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-record-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-sample-code-and-libraries': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-saveditem-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-savedsearch-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-search-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-suggestions-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api-tag-json': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/api/console': 'https://pro.europeana.eu/what-we-do/creative-industries',
  '/collections/archaeology': '/collections/topic/80-archaeology',
  '/collections/art': '/collections/topic/190-art',
  '/collections/fashion': '/collections/topic/55-fashion',
  '/collections/industrial-heritage': '/collections/topic/129-industrial-heritage',
  '/collections/manuscripts': '/collections/topic/17-manuscripts',
  '/collections/maps': '/collections/topic/151-maps-and-geography',
  '/collections/migration': '/collections/topic/128-migration',
  '/collections/migration/collection-days-stories': '/migration/explore-migration-stories-from-events-in-these-cities',
  '/collections/migration/collection-days': '/europeana-migration-collection-days',
  '/collections/migration/explore-migration-stories': '/collections/topic/128-migration',
  '/collections/music': '/collections/topic/62-music',
  '/collections/natural-history': '/collections/topic/156-natural-history',
  '/collections/newspapers': '/collections/topic/18-newspaper',
  '/collections/newspapers/a-z-all': '/collections/topic/18-newspapers',
  '/collections/newspapers/newspapers-help-guides': '/collections/topic/18-newspapers',
  '/collections/photography': '/collections/topic/48-photography',
  '/collections/sport': '/collections/topic/114-sport',
  '/collections/world-war-I': '/collections/topic/83-1914-1918',
  '/communities_artnouveau': { status: 410 },
  '/communities_biodiversity': { status: 410 },
  '/communities_maps': { status: 410 },
  '/communities_medieval': { status: 410 },
  '/communities': { status: 410 },
  '/contact': '/contact-us',
  '/data-usage-guide': '/rights/usage-guidelines-for-metadata',
  '/exhibitions/foyer': '/exhibitions',
  '/explore/galleries': '/galleries',
  '/kindle_competition': { status: 410 },
  '/languagepolicy': '/rights/privacy-policy',
  '/pd-usage-guide': '/rights/public-domain-usage-guidelines',
  '/privacy': '/rights/privacy-policy',
  '/reading_europe': 'http://www.theeuropeanlibrary.org/exhibition-reading-europe/',
  '/rec': { status: 410 },
  '/rights/accessibility': '/rights/accessibility-policy',
  '/rights/api': '/rights/api-terms-of-use',
  '/rights/contributions': '/rights/terms-for-user-contributions',
  '/rights/data-sources': '/rights/europeana-data-sources',
  '/rights/language': '/rights/language-policy',
  '/rights/languagepolicy': '/rights/language-policy',
  '/rights/linked-data-sources': '/rights/europeana-data-sources',
  '/rights/metadata-usage-guidelines': '/rights/usage-guidelines-for-metadata',
  '/rights/metadata': '/rights/usage-guidelines-for-metadata',
  '/rights/pd-usage-guide': '/rights/public-domain-usage-guidelines',
  '/rights/privacy': '/rights/privacy-policy',
  '/rights/public-domain': '/rights/public-domain-usage-guidelines',
  '/rights/terms-and-policies': '/rights',
  '/rights/terms': '/rights/terms-of-use',
  '/rr-f': '/rights/rr-f',
  '/termsofservice': '/rights/terms-of-use'
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
      query: redirectTo.query,
      status: redirectTo.status
    };
  }
  return null;
};
