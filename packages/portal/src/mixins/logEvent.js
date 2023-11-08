import axios from 'axios';
import isbot from 'isbot';

export default {
  methods: {
    async logEvent(actionType, objectUri) {
      const loggingPermitted = this.$features?.eventLogging &&
        process.client &&
        !isbot(navigator?.userAgent) &&
        this.$session?.isActive;

      if (!loggingPermitted) {
        return false;
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
      } catch (e) {
        return false;
      }
    }
  }
};
