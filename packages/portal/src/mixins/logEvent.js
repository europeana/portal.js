import axios from 'axios';
import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

export default {
  methods: {
    // TODO: exclude certain user agents, e.g. bots
    // TODO: log user agent and session id?
    logEvent(actionType, itemIdentifier) {
      if (!this.$features.eventLogging) {
        return;
      }

      let objectUri = itemIdentifier;
      if (!objectUri.startsWith(ITEM_URL_PREFIX)) {
        objectUri = `${ITEM_URL_PREFIX}${objectUri}`;
      }

      const postData = {
        actionType,
        objectUri
      };

      return axios.create({
        baseURL: this.$config.app.baseUrl
      }).post(
        '/_api/events/log',
        postData
      );
    }
  }
};
