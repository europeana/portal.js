export default {
  entity: {
    origin: 'https://api.europeana.eu',
    path: '/entity',
    key: process.env['EUROPEANA_ENTITY_API_KEY']
  },
  data: {
    origin: 'http://data.europeana.eu'
  },
  newspaper: {
    origin: 'https://newspapers.eanadev.org',
    path: '/api/v2',
    key: process.env['EUROPEANA_NEWSPAPER_API_KEY'] || process.env['EUROPEANA_RECORD_API_KEY']
  },
  record: {
    origin: 'https://api.europeana.eu',
    path: '/record',
    key: process.env['EUROPEANA_RECORD_API_KEY']
  },
  thumbnail: {
    origin: 'https://api.europeana.eu',
    path: '/api/v2'
  }
};
