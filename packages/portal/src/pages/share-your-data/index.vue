<template>
  <div
    class="page white-page xxl-page"
  >
    <h1>{{ title }}</h1>
    <p>{{ headline }}</p>
    <!-- Header/hero -->
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ShareYourDataPage',

    mixins: [pageMetaMixin],

    data() {
      return {
        title: null,
        description: null,
        headline: null,
        cta: null,
        sections: [],
        primaryImageOfPage: null,
        socialMediaImage: null
      };
    },

    async fetch() {
      await this.fetchContentfulEntry();
    },

    computed: {
      pageMeta() {
        return {
          title: this.title,
          description: this.description,
          ogType: 'article',
          ogImage: this.ogImage?.url,
          ogImageAlt: this.ogImage?.description
        };
      },

      ogImage() {
        return this.socialMediaImage || this.primaryImageOfPage?.image;
      }
    },

    methods: {
      async fetchContentfulEntry() {
        const variables = {
          identifier: 'share-your-data',
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };
        const response = await this.$contentful.query('landingPage', variables);
        const page = response.data.data.landingPage.items[0];
        this.title = page.name;
        this.description = page.description;
        this.headline = page.headline;
        this.cta = page.relatedLink;
        this.sections = page.hasPartCollection.items.filter((item) => !!item);
        this.primaryImageOfPage = page.primaryImageOfPage;
        this.socialMediaImage = page.image;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .page {
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }
  }
</style>
