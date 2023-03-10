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
      <RelatedCategoryTags
        v-if="($features.storiesPageAllTags || selectedTags.length > 0) && (displayTags.length > 0)"
        :tags="displayTags"
        :selected="selectedTags"
        :heading="false"
        class="responsive-font mb-2"
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
        <template
          v-for="(entry, index) in stories"
        >
          <template
            v-if="page === 1 && entry === ctaBanner"
          >
            <CallToActionBanner
              v-if="callsToAction[0]"
              :key="index"
              :name="callsToAction[0].name"
              :text="callsToAction[0].text"
              :link="callsToAction[0].relatedLink"
              :illustration="callsToAction[0].image"
              class="cta-banner"
            />
          </template>
          <ContentCard
            v-else-if="entry !== ctaBanner"
            :key="index"
            :title="entry.name"
            :url="entryUrl(entry)"
            :image-url="entry.primaryImageOfPage && entry.primaryImageOfPage.image.url"
            :image-content-type="entry.primaryImageOfPage && entry.primaryImageOfPage.image.contentType"
            :image-optimisation-options="entry.primaryImageOfPage ? entryImageOptions(entry.primaryImageOfPage.image) : {}"
          />
        </template>
      </b-card-group>
      <PaginationNavInput
        :per-page="perPage"
        :total-results="total"
      />
    </div>
  </div>
</template>

<script>
  import RelatedCategoryTags from '@/components/related/RelatedCategoryTags';
  import ContentCard from '@/components/generic/ContentCard';
  import ContentHeader from '@/components/generic/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';
  import pageMetaMixin from '@/mixins/pageMeta';

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

    mixins: [pageMetaMixin],

    middleware: 'sanitisePageQuery',

    data() {
      return {
        perPage: 24,
        selectedTags: [],
        filteredTags: null,
        stories: [],
        tags: [],
        total: 0,
        sections: [],
        headline: null,
        description: null,
        socialMediaImage: null,
        pageFetched: false,
        ctaBanner: 'cta-banner'
      };
    },

    async fetch() {
      await Promise.all([
        this.fetchPage(),
        this.fetchStories()
      ]);

      this.stories.splice(12, 0, this.ctaBanner);

      this.$scrollTo && this.$scrollTo('#header');
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
      callsToAction() {
        return this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
      },
      displayTags() {
        if (this.filteredTags) {
          return this.tags.filter((tag) => this.filteredTags.includes(tag.identifier) || this.selectedTags.includes(tag.identifier));
        } else {
          return this.tags;
        }
      },
      page() {
        return Number(this.$route.query.page || 1);
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
        this.sections = storiesPage?.hasPartCollection?.items || [];
        this.headline = storiesPage?.headline;
        this.description = storiesPage?.description;
        this.socialMediaImage = storiesPage?.image;
        this.pageFetched = true;
      },

      async fetchStories() {
        this.selectedTags = this.$route.query.tags?.split(',') || [];

        const response = await (this.$axios.post('/_api/contentful/stories', {
          page: this.$route.query.page || 1,
          limit: this.perPage,
          tags: this.$route.query.tags,
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview'
        }));

        this.stories = response.data.items;
        this.total = response.data.total;
        this.filteredTags = response.data.tags;
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
      },

      entryImageOptions(image) {
        return image.width <= image.height ? { width: 660 } : { height: 620 };
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

.context-label {
  font-size: $font-size-small;

  @media (min-width: $bp-xxxl) {
    font-size: $responsive-font-size-small;
  }
}

.cta-banner {
  flex-basis: 100%;

  @media (min-width: $bp-small) {
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
  }
}
</style>
