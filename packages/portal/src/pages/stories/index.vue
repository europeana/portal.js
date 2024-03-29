<template>
  <div class="page white-page xxl-page">
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
      <ContentHeader
        :title="pageMeta.title"
        :description="headline"
        :media-url="pageMeta.ogImage"
        button-variant="secondary"
        class="half-col"
      />
      <StoriesInterface
        :call-to-action="callToAction"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import StoriesInterface from '@/components/stories/StoriesInterface';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'StoriesPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      StoriesInterface,
      LoadingSpinner
    },

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    data() {
      return {
        sections: [],
        headline: null,
        description: null,
        socialMediaImage: null,
        pageFetched: false
      };
    },

    async fetch() {
      if (this.pageFetched) {
        return;
      }
      const pageVariables = {
        identifier: 'stories',
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };
      const pageResponse = await this.$contentful.query('storiesPage', pageVariables);
      const storiesPage = pageResponse.data.data.browsePageCollection.items[0];
      this.sections = storiesPage?.hasPartCollection?.items || [];
      this.headline = storiesPage?.headline;
      this.description = storiesPage?.description;
      this.socialMediaImage = storiesPage?.image;
      this.pageFetched = true;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('storiesPage.title'),
          description: this.description,
          ogType: 'article',
          ogImage: this.socialMediaImage?.url,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      callToAction() {
        return this.sections?.filter(section => section['__typename'] === 'PrimaryCallToAction')[0];
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/mixins';

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
</style>
