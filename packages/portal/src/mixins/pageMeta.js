import { isContentfulAssetUrl, optimisedContentfulImageUrl } from '@/utils/contentful/assets.js';

export default {
  data() {
    return {
      pageMetaContentfulImageParams: { w: 1200, h: 630, fit: 'fill', f: 'face' },
      pageMetaSuffixTitle: undefined
    };
  },

  head() {
    return {
      title: this.headTitle,
      meta: this.headMeta
    };
  },

  computed: {
    headTitle() {
      const pageMetaSuffixTitle = (this.pageMetaSuffixTitle === undefined) ? this.$config.app.siteName : this.pageMetaSuffixTitle;
      return [this.pageTitle, pageMetaSuffixTitle].filter((part) => !!part).join(' | ');
    },

    pageMeta() {
      return {};
    },

    pageMetaOgImage() {
      if (isContentfulAssetUrl(this.pageMeta.ogImage?.url)) {
        return optimisedContentfulImageUrl(this.pageMeta.ogImage, this.pageMetaContentfulImageParams);
      } else {
        return this.pageMeta.ogImage?.url || this.pageMeta.ogImage;
      }
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

    metaTitle() {
      return [this.pageTitle, this.pageMeta.subtitle].filter(Boolean).join(' - ');
    },

    headMeta() {
      const headMeta = [
        { hid: 'title', name: 'title', content: this.metaTitle },
        { hid: 'og:title', property: 'og:title', content: this.metaTitle }
      ];

      if (this.pageMeta.description) {
        headMeta.push({ hid: 'description', name: 'description', content: this.pageMeta.description });
        headMeta.push({ hid: 'og:description', property: 'og:description', content: this.pageMeta.description });
      }

      if (this.pageMeta.ogType) {
        headMeta.push({ hid: 'og:type', property: 'og:type', content: this.pageMeta.ogType });
      }

      if (this.pageMeta.ogImage) {
        headMeta.push({ hid: 'og:image', property: 'og:image', content: this.pageMetaOgImage });
      }
      if (this.pageMeta.ogImageAlt || (this.pageMeta.ogImageAlt === '')) {
        headMeta.push({ hid: 'og:image:alt', property: 'og:image:alt', content: this.pageMeta.ogImageAlt });
      }

      return headMeta;
    }
  }
};
