import axios from 'axios';
import isbot from 'isbot';
import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

export default {
  methods: {
    // TODO: if session is not active yet, push to a queue instead; watch for
    //       changes to session active
    async logEvent(actionType, itemIdentifier) {
      const loggingPermitted = this.$features.eventLogging &&
        process.client &&
        !isbot(navigator?.userAgent) &&
        this.$session?.isActive;

      if (!loggingPermitted) {
        return false;
      }

      console.log('logEvent', actionType, itemIdentifier)

      let objectUri = itemIdentifier;
      if (!objectUri.startsWith(ITEM_URL_PREFIX)) {
        objectUri = `${ITEM_URL_PREFIX}${objectUri}`;
      }

      const postData = {
        actionType,
        objectUri,
        sessionId: this.$session.id
      };

      try {
       await axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/events',
          postData
        );
        return true;
      } catch(e) {
        return false;
      }
    }
  }
};
