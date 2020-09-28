export default Object.freeze({
  annotation: {
    // TODO: replace with API gateway origin when it works
    url: process.env.EUROPEANA_ANNOTATION_API_URL || 'https://annotations.europeana.eu/annotation',
    key: process.env.EUROPEANA_ANNOTATION_API_KEY || process.env.EUROPEANA_API_KEY
  },
  entity: {
    url: process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity',
    key: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY
  },
  newspaper: {
    url: process.env.EUROPEANA_NEWSPAPER_API_URL || 'https://newspapers.eanadev.org/api/v2',
    key: process.env.EUROPEANA_NEWSPAPER_API_KEY || process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
  },
  recommendation: {
    url: process.env.EUROPEANA_RECOMMENDATION_API_URL || 'https://api.europeana.eu/recommend'
  },
  record: {
    url: process.env.EUROPEANA_RECORD_API_URL || 'https://api.europeana.eu/record',
    key: process.env.EUROPEANA_RECORD_API_KEY || process.env.EUROPEANA_API_KEY
  },
  set: {
    url: process.env.EUROPEANA_SET_API_URL || 'https://api.europeana.eu/set',
    key: process.env.EUROPEANA_SET_API_KEY || process.env.EUROPEANA_API_KEY
  },
  thumbnail: {
    url: process.env.EUROPEANA_THUMBNAIL_API_URL || 'https://api.europeana.eu/thumbnail/v2'
  }
});

export const EUROPEANA_DATA_URL = 'http://data.europeana.eu';
