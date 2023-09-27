import uniq from 'lodash/uniq';

export default {
  data() {
    return {
      preconnectOriginUrls: []
    };
  },

  head() {
    return this.pageMetaHead;
  },

  computed: {
    pageMetaHead() {
      return {
        link: this.headLink,
        meta: this.headMeta,
        title: this.headTitle
      };
    },

    headLink() {
      const preconnectOriginUrls = this.preconnectOriginUrls.map((url) => {
        for (const rewriteOrigin of this.$config.axiosLogger.rewriteOrigins) {
          url = url.replace(rewriteOrigin.from, rewriteOrigin.to);
        }
        return url;
      });
      const preconnectOrigins = preconnectOriginUrls.map((url) => new URL(url).origin);
      return uniq(preconnectOrigins).map((href) => ({ rel: 'preconnect', href }));
    },

    headTitle() {
      return [this.pageTitle, this.$config.app.siteName].filter((part) => !!part).join(' | ');
    },

    pageMeta() {
      return {};
    },

    pageTitle() {
      if (this.$fetchState?.error) {
        return this.$fetchState.error.i18n?.metaTitle ||
          this.$fetchState.error.i18n?.title ||
          this.$t('error');
      } else {
        return this.pageMeta.title;
      }
    },

    headMeta() {
      const headMeta = [
        { hid: 'title', name: 'title', content: this.pageTitle },
        { hid: 'og:title', property: 'og:title', content: this.pageTitle }
      ];

      if (this.pageMeta.description) {
        headMeta.push({ hid: 'description', name: 'description', content: this.pageMeta.description });
        headMeta.push({ hid: 'og:description', property: 'og:description', content: this.pageMeta.description });
      }

      if (this.pageMeta.ogType) {
        headMeta.push({ hid: 'og:type', property: 'og:type', content: this.pageMeta.ogType });
      }

      if (this.pageMeta.ogImage) {
        headMeta.push({ hid: 'og:image', property: 'og:image', content: this.pageMeta.ogImage });
      }
      if (this.pageMeta.ogImageAlt || (this.pageMeta.ogImageAlt === '')) {
        headMeta.push({ hid: 'og:image:alt', property: 'og:image:alt', content: this.pageMeta.ogImageAlt });
      }

      return headMeta;
    }
  }
};
