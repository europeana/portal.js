export default {
  origin: process.env.EUROPEANA_API_ORIGIN || 'https://api.europeana.eu',
  keys: {
    entity: process.env.EUROPEANA_ENTITY_API_KEY,
    // TODO: deprecate EUROPEANA_API_KEY env var
    record: process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
  }
};
