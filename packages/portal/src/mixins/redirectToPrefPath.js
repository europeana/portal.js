import { getLabelledSlug } from '@/plugins/europeana/utils';

export default {
  methods: {
    redirectToPrefPath(page, id, label, query, params = {}) {
      const desiredPath = label ? getLabelledSlug(id, label) : id;
      if (this.$route.params.pathMatch !== desiredPath) {
        const redirectPath = this.localePath({
          name: page,
          params: { ...params, pathMatch: desiredPath },
          query
        });
        if (process.server) {
          this.$nuxt.context.redirect(302, redirectPath);
        } else {
          // _Replace_ history entry to prevent interference with back button
          this.$nuxt.context.app.router.replace(redirectPath);
        }
      }
    }
  }
};
