import { getLabelledSlug } from '@/plugins/europeana/utils';

export default {
  methods: {
    redirectToPrefPath(page, id, label, params = {}) {
      const desiredPath = getLabelledSlug(id, label);
      if (this.$route.params.pathMatch !== desiredPath) {
        const redirectPath = this.$path({
          name: page,
          params: { ...params, pathMatch: desiredPath }
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
