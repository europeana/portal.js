import { getLabelledSlug } from '@/plugins/europeana/utils.js';

export default {
  methods: {
    // Makes alterations to the current route then redirects to it
    redirectToAltRoute(changes = {}) {
      const redirectRoute = {
        hash: this.$route.hash || '',
        name: this.$route.name || '',
        params: this.$route.params || {},
        query: this.$route.query || {},
        ...changes
      };

      if (process.server) {
        this.$nuxt.context.redirect(302, redirectRoute);
      } else {
        // _Replace_ history entry to prevent interference with back button
        this.$nuxt.context.app.router.replace(redirectRoute);
      }
    },

    redirectToPrefPath(id, label) {
      const pathMatch = getLabelledSlug(id, label);
      if (this.$route.params.pathMatch !== pathMatch) {
        const params = {
          ...this.$route.params,
          pathMatch
        };
        delete params['0']; // duplicates original pathMatch for some reason

        this.redirectToAltRoute({ params });
      }
    }
  }
};
