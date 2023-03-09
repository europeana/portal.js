<template>
  <div>
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
    <div
      v-else
      class="page white-page gridless-container responsive-font"
    >
      <ContentHeader
        :title="pageMeta.title"
        :description="headline"
        :media-url="pageMeta.ogImage"
        button-variant="secondary"
        class="half-col"
      />
      <client-only>
        <StoriesInterface
          :call-to-action="callToAction"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ContentHeader from '@/components/generic/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import StoriesInterface from '@/components/stories/StoriesInterface';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'StoriesPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ClientOnly,
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
      this.fetchPage()
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
    },

    methods: {
      async fetchPage() {
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
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
@import '@/assets/scss/mixins';

.page {
  padding-bottom: 1rem;
  padding-top: 1rem;
  margin-top: -1rem;
}
</style>
