import EuropeanaApi from '../base.js';
import { BASE_URL as EUROPEANA_IIIF_BASE_URL } from './index.js';

export default class EuropeanaIiifPresentationApi extends EuropeanaApi {
  static ID = 'iiifPresentation';
  static BASE_URL = `${EUROPEANA_IIIF_BASE_URL}/presentation`;
}
