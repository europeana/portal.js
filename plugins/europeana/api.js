export default {
  entity: {
    origin: process.env.EUROPEANA_ENTITY_API_ORIGIN || 'https://api.europeana.eu',
    path: '/entity',
    key: process.env.EUROPEANA_ENTITY_API_KEY
  },
  data: {
    origin: process.env.EUROPEANA_DATA_API_ORIGIN || 'http://data.europeana.eu'
  },
  newspaper: {
    origin: process.env.EUROPEANA_NEWSPAPER_API_ORIGIN || 'https://newspapers.eanadev.org',
    path: '/api/v2',
    key: process.env.EUROPEANA_NEWSPAPER_API_KEY || process.env.EUROPEANA_RECORD_API_KEY
  },
  record: {
    origin: process.env.EUROPEANA_RECORD_API_ORIGIN || 'https://api.europeana.eu',
    path: '/record',
    key: process.env.EUROPEANA_RECORD_API_KEY
  },
  thumbnail: {
    origin: process.env.EUROPEANA_THUMBNAIL_API_ORIGIN || 'https://api.europeana.eu',
    path: '/api/v2'
  }
};
