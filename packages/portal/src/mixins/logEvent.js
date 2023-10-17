import axios from 'axios';
import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

export default {
  methods: {
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

      // TODO: validate contents of postData, e.g.
      //       { objectUri: "https:/www.europeana.eu/item/123/abc", actionType: "view" }
      // TODO: exclude certain user agents, e.g. bots

      return axios.create({
        baseURL: this.$config.app.baseUrl
      }).post(
        '/_api/events/log',
        postData
      );
    }
  }
};
