<template>
  <div
    data-qa="stories interface"
  >
    <client-only>
      <StoriesTagsDropdown
        :filtered-tags="filteredTags"
        :selected-tags="selectedTags"
      />
    </client-only>
    <div
      class="mb-4 context-label"
    >
      {{ $tc('items.itemCount', total, { count: total }) }}
      <div
        class="visually-hidden"
        role="status"
        data-qa="results status message"
      >
        {{ $t('storiesPage.storiesHaveLoaded', [total]) }}
      </div>
    </div>
    <b-container
      v-if="$fetchState.pending"
      data-qa="stories loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <b-card-group
      v-else
      class="card-deck-4-cols"
      deck
    >
      <StoriesFeaturedCard
        v-if="featuredStory"
        :featured-story="featuredStory"
      />
      <template
        v-for="(entry, index) in stories"
      >
        <div
          v-if="entry === ctaBanner"
          :key="index"
          class="cta-banner-wrapper"
        >
          <CallToActionBanner
            v-if="callToAction"
            :name="callToAction.name"
            :name-english="callToAction.nameEN"
            :text="callToAction.text"
            :link="callToAction.relatedLink"
            :illustration="callToAction.image"
          />
        </div>
        <ContentCard
          v-else-if="entry !== ctaBanner"
          :key="index"
          :title="entry.name"
          :url="contentfulEntryUrl(entry)"
          :image-url="entry.primaryImageOfPage && entry.primaryImageOfPage.image.url"
          :image-content-type="entry.primaryImageOfPage && entry.primaryImageOfPage.image.contentType"
          :image-optimisation-options="entry.primaryImageOfPage ? entryImageOptions(entry.primaryImageOfPage.image) : {}"
        />
      </template>
    </b-card-group>
    <PaginationNavInput
      v-if="total > perPage"
      :per-page="perPage"
      :total-results="total"
    />
  </div>
</template>

<script>
  import uniq from 'lodash/uniq';
  import ClientOnly from 'vue-client-only';

  import ContentCard from '@/components/content/ContentCard';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import { contentfulEntryUrl } from '@/utils/contentful/entry-url.js';

  const CTA_BANNER = 'cta-banner';

  export default {
    name: 'StoriesInterface',

    components: {
      CallToActionBanner: () => import('../generic/CallToActionBanner'),
      ClientOnly,
      ContentCard,
      LoadingSpinner,
      PaginationNavInput: () => import('../generic/PaginationNavInput'),
      StoriesFeaturedCard: () => import('./StoriesFeaturedCard'),
      StoriesTagsDropdown: () => import('../stories/StoriesTagsDropdown')
    },

    props: {
      callToAction: {
        type: Object,
        default: () => {}
      },
      featuredStory: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        allStoryMetadata: null,
        ctaBanner: CTA_BANNER,
        perPage: 24,
        stories: []
      };
    },

    async fetch() {
      if (!this.allStoryMetadata) {
        await this.fetchStoryMetadata();
      }
      await this.fetchStories();
    },

    computed: {
      selectedTags() {
        return this.$route.query.tags?.split(',') || [];
      },
      filteredTags() {
        const relevantTags = this.relevantStoryMetadata.map((story) => story.cats).flat();
        const tagsSortedByMostUsed = relevantTags.map((tag, i, array) => {
          return { tag, total: array.filter(t => t === tag).length };
        }).sort((a, b) => b.total - a.total).map(tag => tag.tag);

        return uniq(tagsSortedByMostUsed);
      },
      relevantStoryMetadata() {
        if (this.allStoryMetadata && (this.selectedTags.length > 0)) {
          // Filter by selected categories
          return this.allStoryMetadata.filter((story) => {
            return this.selectedTags.every((tag) => story.cats.includes(tag));
          });
        }
        return this.allStoryMetadata || [];
      },
      total() {
        return this.relevantStoryMetadata?.length || 0;
      },
      page() {
        return Number(this.$route.query.page || 1);
      }
    },

    watch: {
      page: '$fetch',
      selectedTags: '$fetch'
    },

    methods: {
      async fetchStoryMetadata() {
        // Fetch minimal data for all stories to support ordering by datePublished
        // and filtering by categories.
        const storyIdsVariables = {
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview',
          redirectBlogsToStories: this.$features?.redirectBlogsToStories || false
        };
        const storyIdsResponse = await this.$contentful.query('storiesMinimal', storyIdsVariables);
        const storyIds = [
          storyIdsResponse.data.data.blogPostingCollection?.items || [],
          storyIdsResponse.data.data.exhibitionPageCollection?.items,
          storyIdsResponse.data.data.storyCollection?.items || []
        ].flat();

        // Simplify categories
        for (const story of storyIds) {
          story.cats = (story.cats?.items || []).filter((cat) => !!cat).map((cat) => cat.id);
        }

        // Order by date published
        this.allStoryMetadata = storyIds.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
      },

      async fetchStories() {
        // Paginate
        const sliceFrom = (this.page - 1) * this.perPage;
        const sliceTo = sliceFrom + this.perPage;
        const storySysIds = this.relevantStoryMetadata.slice(sliceFrom, sliceTo).map(story => story.sys.id);

        // Fetch full data for display of page of stories
        const storiesVariables = {
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview',
          limit: this.perPage,
          ids: storySysIds
        };
        const storiesResponse = await this.$contentful.query('storiesBySysId', storiesVariables);
        const fullStories = [
          storiesResponse.data.data.blogPostingCollection?.items,
          storiesResponse.data.data.exhibitionPageCollection.items,
          storiesResponse.data.data.storyCollection?.items
        ].flat();
        this.stories = storySysIds.map((sysId) => fullStories.find((story) => story.sys.id === sysId)).filter(Boolean);
        if (this.page === 1 && this.selectedTags.length === 0) {
          this.stories.splice(12, 0, this.ctaBanner);
        }
        this.$scrollTo?.('#header');
      },

      contentfulEntryUrl,

      entryImageOptions(image) {
        return image.width <= image.height ? { width: 660 } : { height: 620 };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.context-label {
  font-size: $font-size-small;

  @media (min-width: $bp-4k) {
    font-size: $font-size-small-4k;
  }
}

.cta-banner-wrapper {
  flex-basis: 100%;

  @media (min-width: $bp-small) {
    padding-left: $grid-gutter;
    padding-right: $grid-gutter;
  }

  @media (min-width: $bp-xxl) {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
