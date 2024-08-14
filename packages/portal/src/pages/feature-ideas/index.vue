<template>
  <div class="page white-page text-page xxl-page">
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
    <b-container
      v-else-if="$fetchState.error"
      data-qa="alert message container"
    >
      <b-row class="flex-md-row py-4">
        <b-col cols="12">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-else
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ContentHeader
              :title="pageMeta.title"
              :media-url="pageMetaOgImage"
              button-variant="secondary"
              class="half-col"
            />
            <div
              class="authored-section"
            >
              <ContentRichText
                v-if="text"
                :text="text"
                :rich-text-is-card="false"
                class="rich-text"
              />
              <FeatureIdeas
                :features="features"
              />
            </div>
          </article>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'FeatureIdeasPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      ContentRichText: () => import('@/components/content/ContentRichText'),
      FeatureIdeas: () => import('@/components/generic/FeatureIdeas'),
      LoadingSpinner
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        name: null,
        description: null,
        socialMediaImage: null,
        pageFetched: false,
        text: null,
        features: []
      };
    },

    async fetch() {
      if (this.pageFetched) {
        return;
      }
      const pageVariables = {
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const pageResponse = await this.$contentful.query('featureIdeasPage', pageVariables);
      const featuresPage = pageResponse.data.data.featureIdeasPageCollection.items[0];

      if (!featuresPage) {
        return;
      }

      this.name = featuresPage.name;
      this.description = featuresPage.description;
      this.socialMediaImage = featuresPage.image;
      this.text = featuresPage.text;
      this.features = featuresPage.hasPartCollection.items.filter(feature => !!feature) || [];

      this.pageFetched = true;
    },

    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogType: 'article',
          ogImage: this.socialMediaImage,
          ogImageAlt: this.socialMediaImage?.description
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.page {
  padding-bottom: 1rem;
  padding-top: 1rem;
  margin-top: -1rem;

  @media (min-width: $bp-4k) {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    margin-top: -1.5rem;
  }
}

::v-deep .content-header {
  &.half-col .col {
    margin-bottom: 1.5rem;
  }

  .divider {
    display: none;
  }
}

.rich-text ::v-deep p {
  @media (min-width: $bp-4k) {
    font-size: calc(1.5 * 1.125rem);
  }
}

.col-lg-8 {
  max-width: $max-text-column-width;
}
</style>
