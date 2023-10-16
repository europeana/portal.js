import axios from 'axios';
import canonicalUrlMixin from '@/mixins/canonicalUrl';

export default {
  mixins: [
    canonicalUrlMixin
  ],

  methods: {
    logEvent(actionType) {
      if (!this.$features.eventLogging) {
        return;
      }

      const postData = {
        actionType,
        objectUri: this.canonicalUrl({ fullPath: false, locale: false })
      };
      console.log('logEvent', postData);
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
