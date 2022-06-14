<template>
  <div>
    <template
      v-if="$features.newStoriesPage"
    >
      <ContentHeader
        :title="pageTitle"
      />
      <b-card-group
        class="card-deck-3-cols justify-content-center"
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
      <PaginationNav
        :per-page="perPage"
        :total-results="total"
      />
    </template>
    <IndexPage
      v-else
    />
  </div>
</template>

<script>
  import ContentCard from '@/components/generic/ContentCard';
  import ContentHeader from '@/components/generic/ContentHeader';
  import PaginationNav from '@/components/generic/PaginationNav';

  export default {
    name: 'StoriesPage',

    components: {
      ContentCard,
      ContentHeader,
      IndexPage: () => import('../index'),
      PaginationNav
    },

    data() {
      return {
        perPage: 18,
        stories: [],
        total: 0
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
        // TODO: read this from CTF home page content entry instead?
        return this.$t('storiesPage.title');
      }
    },

    watch: {
      '$route.query.page': 'fetchContentfulEntries'
    },

    methods: {
      async fetchContentfulEntries() {
        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };
        const response = await this.$contentful.query('storiesPage', variables);

        const page = this.$route.query.page || 1;
        const sliceFrom = (page - 1) * this.perPage;
        const sliceTo = sliceFrom + this.perPage;

        const stories = response.data.data.blogPostingCollection.items
          .concat(response.data.data.exhibitionPageCollection.items)
          .sort((a, b) => (new Date(b.datePublished)).getTime() - (new Date(a.datePublished)).getTime());
        this.total = stories.length;
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
