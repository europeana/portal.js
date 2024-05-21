import EuropeanaApi from '../base.js';
import { EUROPEANA_IIIF_API_BASE_URL } from './index.js';

export default class EuropeanaIiifPresentationApi extends EuropeanaApi {
  static ID = 'iiifPresentation';
  static BASE_URL = `${EUROPEANA_IIIF_API_BASE_URL}/presentation`;
}
