import axios from 'axios';
import isbot from 'isbot';
import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

export default {
  methods: {
    logEvent(actionType, itemIdentifier) {
      const loggingPermitted = this.$features.eventLogging &&
        process.client &&
        !isbot(navigator?.userAgent) &&
        this.$session?.id;

      if (!loggingPermitted) {
        return;
      }

      let objectUri = itemIdentifier;
      if (!objectUri.startsWith(ITEM_URL_PREFIX)) {
        objectUri = `${ITEM_URL_PREFIX}${objectUri}`;
      }

      const postData = {
        actionType,
        objectUri,
        sessionId: this.$session.id
      };

      return axios.create({
        baseURL: this.$config.app.baseUrl
      }).post(
        '/_api/events',
        postData
      );
    }
  }
};
