// TODO: deprecate EUROPEANA_API_KEY env var
export default {
  entity: {
    origin: process.env.EUROPEANA_ENTITY_API_ORIGIN || process.env.EUROPEANA_API_ORIGIN || 'https://api.europeana.eu',
    key: process.env.EUROPEANA_ENTITY_API_KEY
  },
  newspaper: {
    origin: process.env.EUROPEANA_NEWSPAPER_API_ORIGIN || 'https://newspapers.eanadev.org',
    key: process.env.EUROPEANA_NEWSPAPER_API_KEY || process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
  },
  record: {
    origin: process.env.EUROPEANA_RECORD_API_ORIGIN || process.env.EUROPEANA_API_ORIGIN || 'https://api.europeana.eu',
    key: process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
  }
};
