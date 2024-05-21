import EuropeanaApi from '../base.js';

export const EUROPEANA_IIIF_API_BASE_URL = 'https://iiif.europeana.eu';

export default class EuropeanaIiifImageApi extends EuropeanaApi {
  static ID = 'iiifImage';
  static BASE_URL = `${EUROPEANA_IIIF_API_BASE_URL}/image`;
}
