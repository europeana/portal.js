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
      return !!(
        this.$features?.eventLogging &&
        this.eventToLog &&
        !this.eventLogged &&
        !this.$fetchState?.error &&
        process.client &&
        !isbot(navigator?.userAgent) &&
        this.$session?.isActive
      );
    }
  },

  watch: {
    eventMayBeLogged() {
      this.sendEventLog();
    }
  },

  methods: {
    async logEvent(actionType, objectUri) {
      this.eventToLog = { actionType, objectUri };
      await this.sendEventLog();
    },

    async sendEventLog() {
      if (!this.eventMayBeLogged) {
        return;
      }

      const postData = {
        ...this.eventToLog,
        sessionId: this.$session?.id
      };

      try {
        await axios({
          baseURL: this.$config.app.baseUrl,
          method: 'post',
          postData,
          url: '/_api/events'
        });
        this.eventLogged = true;
      } catch (e) {
        this.eventLogged = false;
      }
    }
  }
};
