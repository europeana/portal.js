import Vue from 'vue';
import isHTTPS from 'is-https';

export default (context) => {
  const canonicalUrl = {
    install(Vue) {
      Vue.mixin({
        computed: {
          $canonicalUrl() {
            if (process.server) {
              const scheme = isHTTPS(context.req, true) ? 'https://' : 'http://';
              return scheme + context.req.headers.host + context.route.path;
            } else {
              return window.location.href.split(/\?|#/)[0];
            }
          }
        },

        head() {
          return {
            meta: [
              { hid: 'og:url', property: 'og:url', content: this.$canonicalUrl }
            ]
          };
        }
      });
    }
  };

  Vue.use(canonicalUrl);
};
