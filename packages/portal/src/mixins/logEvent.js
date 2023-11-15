import axios from 'axios';
import isbot from 'isbot';

export default {
  data() {
    return {
      eventLogged: false,
      eventToLog: null
    };
  },

  computed: {
    eventMayBeLogged() {
      return this.$features?.eventLogging &&
        this.eventToLog &&
        !this.eventLogged &&
        !this.$fetchState?.error &&
        process.client &&
        !isbot(navigator?.userAgent) &&
        this.$session?.isActive;
    }
  },

  watch: {
    eventMayBeLogged() {
      this.logEventToApi();
    }
  },

  methods: {
    async logEvent(actionType, objectUri) {
      this.eventToLog = { actionType, objectUri };
      await this.logEventToApi();
    },

    async logEventToApi() {
      if (!this.eventMayBeLogged) {
        return null;
      }

      const postData = {
        ...this.eventToLog,
        sessionId: this.$session?.id
      };

      try {
        await axios.create({
          baseURL: this.$config.app.baseUrl
        }).post(
          '/_api/events',
          postData
        );
        this.eventLogged = true;
      } catch (e) {
        this.eventLogged = false;
      }
    }
  }
};
