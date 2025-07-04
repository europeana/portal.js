<template>
  <div class="page xxl-page">
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
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
      <ContentHeader
        :title="pageMeta.title"
        :description="headline"
        :media-url="pageMetaOgImage"
        button-variant="secondary"
        class="half-col"
      />
      <StoriesInterface
        :call-to-action="callToAction"
        :featured-story="featuredStory"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import StoriesInterface from '@/components/stories/StoriesInterface';
  import storiesPageGraphql from '@/graphql/queries/storiesPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'StoriesPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      LoadingSpinner,
      StoriesInterface
    },

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    data() {
      return {
        headline: null,
        description: null,
        socialMediaImage: null,
        callToAction: null,
        featuredStory: null,
        pageFetched: false
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

      const pageResponse = await this.$contentful.query(storiesPageGraphql, pageVariables);
      const storiesPage = pageResponse.data.storiesPageCollection.items[0];

      if (!storiesPage) {
        return;
      }

      this.headline = storiesPage.headline;
      this.description = storiesPage.description;
      this.socialMediaImage = storiesPage.image;
      this.callToAction = storiesPage.primaryCallToAction;
      this.featuredStory = storiesPage.featuredStory;

      this.pageFetched = true;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$tc('stories.stories', 2),
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
@import '@europeana/style/scss/mixins';

.page {
  padding-bottom: 1rem;

  @media (min-width: $bp-4k) {
    padding-bottom: 1.5rem;
  }
}
</style>
