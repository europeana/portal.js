export const baseConfig = {
  entity: {
    origin: 'https://api.europeana.eu',
    path: '/entity'
  },
  data: {
    origin: 'http://data.europeana.eu'
  },
  newspaper: {
    origin: 'https://newspapers.eanadev.org',
    path: '/api/v2'
  },
  record: {
    origin: 'https://api.europeana.eu',
    path: '/record'
  },
  thumbnail: {
    origin: 'https://api.europeana.eu',
    path: '/api/v2'
  }
};

export let config = Object.assign({}, baseConfig);
