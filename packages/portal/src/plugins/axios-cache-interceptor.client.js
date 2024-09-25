// TODO: consider using this more widely as it brings a very nice performance
//       boost when navigating back and forth e.g. back to search results

import { setupCache } from 'axios-cache-interceptor';
import EuropeanaMediaBase from '@/utils/europeana/media/base.js';

export default () => {
  setupCache(EuropeanaMediaBase.axios);
};
