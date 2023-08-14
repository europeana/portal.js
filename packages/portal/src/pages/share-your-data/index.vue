<template>
  <div
    class="page white-page xxl-page"
  >
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      :show-message="false"
    />
    <div
      v-else
    >
      <h1>{{ title }}</h1>
      <p>{{ headline }}</p>
    </div>
    <!-- Header/hero -->
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';

  export default {
    name: 'ShareYourDataPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner
    },

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
        try {
          const response = await this.$contentful.query('landingPage', variables);
          const page = response.data.data.landingPage.items[0];

          if (page) {
            this.title = page.name;
            this.description = page.description;
            this.headline = page.headline;
            this.cta = page.relatedLink;
            this.sections = page.hasPartCollection.items.filter((item) => !!item);
            this.primaryImageOfPage = page.primaryImageOfPage;
            this.socialMediaImage = page.image;
          } else {
            this.$error(404, { scope: 'page' });
          }
        } catch (error) {
          this.$error(error, { scope: 'page' });
        }
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
