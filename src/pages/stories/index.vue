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
      class="page gridless-container responsive-font"
    >
      <ContentHeader
        :title="pageTitle"
      />
      <CallToActionBanner
        v-if="callsToAction[0]"
        :name="callsToAction[0].name"
        :text="callsToAction[0].text"
        :link="callsToAction[0].relatedLink"
        :illustration="callsToAction[0].image"
      />
      <RelatedCategoryTags
        v-if="($features.storiesPageAllTags || selectedTags.length > 0) && (displayTags.length > 0)"
        :tags="displayTags"
        :selected="selectedTags"
        class="responsive-font"
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
</template>

<script>
  import uniq from 'lodash/uniq';
  import RelatedCategoryTags from '@/components/related/RelatedCategoryTags';
  import ContentCard from '@/components/generic/ContentCard';
  import ContentHeader from '@/components/generic/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';

  export default {
    name: 'StoriesPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      RelatedCategoryTags,
      ContentCard,
      ContentHeader,
      LoadingSpinner,
      CallToActionBanner: () => import('@/components/generic/CallToActionBanner'),
      PaginationNavInput
    },

    data() {
      return {
        perPage: 24,
        selectedTags: [],
        filteredTags: null,
        stories: [],
        tags: [],
        total: 0,
        sections: [],
        pageFetched: false
      };
    },

    async fetch() {
      await Promise.all([
        this.fetchPage(),
        this.fetchStories()
      ]);
      this.$scrollTo && this.$scrollTo('#header');
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
      },
      callsToAction() {
        return this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
      },
      displayTags() {
        if (this.filteredTags) {
          return this.tags.filter((tag) => this.filteredTags.includes(tag.identifier));
        } else {
          return this.tags;
        }
      }
    },

    watch: {
      '$route.query.page': '$fetch',
      '$route.query.tags': '$fetch'
    },

    mounted() {
      this.fetchCategories();
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
        this.sections = storiesPage.hasPartCollection.items;
        this.pageFetched = true;
      },

      async fetchStories() {
        this.selectedTags = this.$route.query.tags?.split(',') || [];
        let stories;

        // Fetch minimal data for all stories to support ordering by datePublished
        // and filtering by categories.
        const storyIdsVariables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };
        const storyIdsResponse = await this.$contentful.query('storiesMinimal', storyIdsVariables);
        stories = [
          storyIdsResponse.data.data.blogPostingCollection.items,
          storyIdsResponse.data.data.exhibitionPageCollection.items
        ].flat();

        // Filter by categories
        if (this.selectedTags.length > 0) {
          stories = stories.filter((story) => {
            const storyTags = story.cats.items.map((cat) => cat.id);
            return this.selectedTags.every((tag) => storyTags.includes(tag));
          });
          this.filteredTags = uniq(stories.map((story) => story.cats.items.map((cat) => cat.id)).flat());
        } else {
          this.filteredTags = null;
        }

        // Order by date published
        stories = stories.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());

        // Paginate
        this.total = stories.length;
        const page = this.$route.query.page || 1;
        const sliceFrom = (page - 1) * this.perPage;
        const sliceTo = sliceFrom + this.perPage;
        const storySysIds = stories.slice(sliceFrom, sliceTo).map(story => story.sys.id);

        // Fetch full data for display of page of stories
        const storiesVariables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          limit: this.perPage,
          ids: storySysIds
        };
        const storiesResponse = await this.$contentful.query('storiesBySysId', storiesVariables);
        stories = [
          storiesResponse.data.data.blogPostingCollection.items,
          storiesResponse.data.data.exhibitionPageCollection.items
        ].flat();
        this.stories = storySysIds.map((sysId) => stories.find((story) => story.sys.id === sysId)).filter(Boolean);
      },

      async fetchCategories() {
        const categoriesVariables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        };
        const categoriesResponse = await this.$contentful.query('categories', categoriesVariables);
        this.tags = (categoriesResponse.data.data.categoryCollection.items || [])
          .sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
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
  @import '@/assets/scss/variables';

  .page {
    background-color: white; // TODO: make this more generic when more and more pages get a white background
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;

    &::after {
      border-top: 145px solid $white;
      border-left: 60px solid transparent;
      content: '';
      display: block;
      height: 0;
      position: absolute;
      right: 0;
      top: 100%;
      width: 0;
      z-index: 1;
    }

    ::v-deep header .col {
      margin-bottom: 1em;
    }
  }

  .context-label {
    font-size: $font-size-small;

    @media (min-width: $bp-xxxl) {
      font-size: $responsive-font-size-small;
    }
  }
</style>
