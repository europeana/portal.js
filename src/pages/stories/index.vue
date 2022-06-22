<template>
  <div
    v-if="$features.newStoriesPage"
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
      class="page gridless-container"
    >
      <ContentHeader
        :title="pageTitle"
      />
      <BlogTags
        v-if="tags.length > 0"
        :tags="tags"
      />
      <div
        class="mb-4 context-label"
      >
        {{ $tc('items.itemCount', total, { count: total }) }}
      </div>
      <b-card-group
        class="card-deck-4-cols gridless-browse-cards"
        deck
      >
        <ContentCard
          v-for="(entry, index) in stories"
          :key="index"
          :title="entry.name"
          :url="entryUrl(entry)"
          :image-url="entry.primaryImageOfPage && entry.primaryImageOfPage.image.url"
          :image-content-type="entry.primaryImageOfPage && entry.primaryImageOfPage.image.contentType"
        />
      </b-card-group>
      <PaginationNavInput
        :per-page="perPage"
        :total-results="total"
      />
    </div>
  </div>
  <IndexPage
    v-else
    slug="stories"
  />
</template>

<script>
  import uniq from 'lodash/uniq';
  import BlogTags from '@/components/blog/BlogTags';
  import ContentCard from '@/components/generic/ContentCard';
  import ContentHeader from '@/components/generic/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'StoriesPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BlogTags,
      ContentCard,
      ContentHeader,
      LoadingSpinner,
      IndexPage: () => import('../index'),
      PaginationNavInput
    },

    data() {
      return {
        perPage: 18,
        stories: [],
        tags: [],
        total: 0,
        // TODO: following four properties required when rendering IndexPage as
        //       a child component; remove when new stories page is launched.
        browsePage: false,
        staticPage: false,
        page: {},
        identifier: null
      };
    },

    async fetch() {
      if (!this.$features.newStoriesPage) {
        return;
      }
      await this.fetchContentfulEntries();
    },

    head() {
      // TODO: add description, social media image, etc
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle }
        ]
      };
    },

    computed: {
      pageTitle() {
        return this.$t('storiesPage.title');
      }
    },

    watch: {
      '$route.query.page': 'fetchContentfulEntries',
      '$route.query.tag': 'fetchContentfulEntries'
    },

    methods: {
      async fetchContentfulEntries() {
        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          tag: this.$route.query.tag,
          withTags: !!this.$route.query.tag
        };
        const response = await this.$contentful.query('storiesPage', variables);

        const page = this.$route.query.page || 1;
        const sliceFrom = (page - 1) * this.perPage;
        const sliceTo = sliceFrom + this.perPage;

        const stories = Object.values(response.data.data)
          .reduce((memo, collection) => memo.concat(collection.items || []), [])
          .sort((a, b) => (new Date(b.datePublished)).getTime() - (new Date(a.datePublished)).getTime());

        this.total = stories.length;
        this.tags = uniq(stories.reduce((memo, story) => memo.concat(story.keywords || []), []))
          .sort((a, b) => a.trim().toLowerCase().localeCompare(b.trim().toLowerCase()));
        this.stories = stories.slice(sliceFrom, sliceTo);
      },

      entryUrl(entry) {
        let urlPrefix;

        if (entry['__typename'] === 'BlogPosting') {
          urlPrefix = '/blog';
        } else if (entry['__typename'] === 'ExhibitionPage') {
          urlPrefix = '/exhibitions';
        }

        return `${urlPrefix}/${entry.identifier}`;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    background-color: white; // TODO: make this more generic when more and more pages get a white background
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;
  }
</style>
