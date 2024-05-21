<template>
  <div
    v-if="(entries && entries.length > 0) || trending"
  >
    <BrowseInfoCardSection
      v-if="key === 'items/type-counts'"
      :section="contentCardSection"
    />
    <ItemTrendingItems
      v-else-if="trending"
      :headline="headline"
    />
    <ContentCardSection
      v-else
      :section="contentCardSection"
      class="mb-5"
    />
  </div>
</template>

<script>
  import ContentCardSection from '../content/ContentCardSection';
  import ItemTrendingItems from '@/components/item/ItemTrendingItems';
  import BrowseInfoCardSection from './BrowseInfoCardSection';
  import { daily, getLabelledSlug } from '@europeana/utils';
  import { addMinimalItemPreviewsToSets } from '@/utils/europeana/set.js';
  import entityImageUrlMixin from '@/mixins/europeana/entities/entityImageUrl';

  const FEATURED_ORGANISATIONS = 'Featured organisations';
  const FEATURED_PLACES = 'Featured places';
  const FEATURED_THEMES = 'Featured themes';
  const FEATURED_TOPICS = 'Featured topics';
  const FEATURED_TIMES = 'Featured centuries';
  const RECENT_ITEMS = 'Recent items';
  const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by media type';
  const LATEST_GALLERIES = 'Latest galleries';
  const TRENDING_ITEMS = 'Trending items';

  export default {
    name: 'BrowseAutomatedCardGroup',

    components: {
      ContentCardSection,
      BrowseInfoCardSection,
      ItemTrendingItems
    },

    mixins: [
      entityImageUrlMixin
    ],

    props: {
      sectionType: {
        type: String,
        required: true
      },
      moreButton: {
        type: Object,
        default: null
      }
    },

    data() {
      const data = {
        key: null,
        cardType: null,
        headline: null,
        contentful: null,
        galleries: null,
        trending: null,
        daily: false,
        entries: []
      };

      if (this.sectionType === FEATURED_ORGANISATIONS) {
        data.key = 'collections/organisations/featured';
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.organisation');
      } else if (this.sectionType === FEATURED_PLACES) {
        data.key = `${this.$i18n.locale}/collections/places/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.place');
      } else if (this.sectionType === FEATURED_THEMES) {
        data.key = `${this.$i18n.locale}/themes/featured`;
        data.contentful = {
          query: 'themes',
          collection: 'themePageCollection'
        };
        data.daily = 4;
        data.cardType = 'AutomatedThemeCard';
        data.headline = this.$i18n.t('automatedCardGroup.theme');
      } else if (this.sectionType === FEATURED_TOPICS) {
        data.key = `${this.$i18n.locale}/collections/topics/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.topic');
      } else if (this.sectionType === FEATURED_TIMES) {
        data.key = `${this.$i18n.locale}/collections/times/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.time');
      } else if (this.sectionType === RECENT_ITEMS) {
        data.key = 'items/recent';
        data.cardType = 'AutomatedRecordCard';
        data.headline = this.$i18n.t('automatedCardGroup.item');
      } else if (this.sectionType === ITEM_COUNTS_MEDIA_TYPE) {
        data.key = 'items/type-counts';
        data.cardType = 'InfoCard';
      } else if (this.sectionType === LATEST_GALLERIES) {
        data.key = `${this.$i18n.locale}/galleries/recent`;
        data.galleries = 'recent';
        data.cardType = 'AutomatedGalleryCard';
        data.headline = this.$i18n.t('automatedCardGroup.gallery');
      } else if (this.sectionType === TRENDING_ITEMS) {
        data.trending = true;
        data.headline = this.$i18n.t('automatedCardGroup.trending');
      }

      return data;
    },

    async fetch() {
      if (this.trending) {
        return;
      } else if (this.contentful) {
        this.entries = await this.fetchContentfulData();
      } else if (this.galleries) {
        this.entries = await this.fetchSetData();
      } else {
        this.entries = await this.fetchCachedData();
      }
      if (this.daily) {
        this.entries = daily(this.entries, this.daily);
      }
    },

    computed: {
      contentCardSection() {
        return {
          type: this.key,
          headline: this.headline,
          hasPartCollection: {
            items: this.hasPartCollectionItems
          },
          moreButton: this.moreButton
        };
      },

      hasPartCollectionItems() {
        let items;

        switch (this.sectionType) {
        case ITEM_COUNTS_MEDIA_TYPE:
          items = this.entries?.map(entry => ({
            __typename: this.cardType,
            url: this.searchFromType(entry.label),
            info: this.$i18n.n(entry.count),
            label: this.$t(`facets.TYPE.options.${entry.label}`),
            image: this.infoImageFromType(entry.label)
          }));
          break;
        case LATEST_GALLERIES:
          items = this.entries?.map(set => ({
            __typename: this.cardType,
            __variant: null,
            name: set.title,
            identifier: set.id,
            image: this.$apis.thumbnail.edmPreview(set.items?.[0].edmPreview, { size: 400 }),
            url: `galleries/${getLabelledSlug(set.id, set.title.en)}`,
            description: set.description
          }));
          break;
        case FEATURED_THEMES:
          items = this.entries?.map(entry => ({
            __typename: this.cardType,
            __variant: null,
            name: entry.name,
            identifier: entry.identifier,
            image: entry.primaryImageOfPage?.image,
            url: `/themes/${entry.identifier}`,
            description: entry.description
          }));
          break;
        default:
          items = this.entries?.map(entry => ({
            __typename: this.cardType,
            __variant: (this.sectionType === RECENT_ITEMS) ? null : 'mini',
            name: entry.prefLabel,
            identifier: entry.id,
            image: this.entityImageUrl(entry),
            encoding: entry,
            logo: !!entry.logo
          }));
        }

        return items;
      }
    },

    methods: {
      fetchCachedData() {
        if (process.server) {
          return import('@/server-middleware/api/cache/index.js')
            .then(module => {
              return module.cached(this.key, this.$config.redis)
                .then((response) => response[this.key]);
            });
        } else {
          return this.$axios.get(`/_api/cache/${this.key}`, { baseURL: window.location.origin })
            .then((response) => response.data[this.key]);
        }
      },
      async fetchContentfulData() {
        const variables = {
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };
        const response = await this.$contentful.query(this.contentful.query, variables);
        return response.data.data[this.contentful.collection].items;
      },
      async fetchSetData() {
        const params = {
          query: 'visibility:published',
          pageSize: 4,
          profile: 'standard',
          qf: `lang:${this.$i18n.locale}`
        };
        const response = await this.$apis.set.search(params);
        response.items = await addMinimalItemPreviewsToSets(response.items, this.$apis.record);
        return response.items || [];
      },
      infoImageFromType(itemType) {
        return `ic-${itemType.toLowerCase()}`;
      },
      searchFromType(itemType) {
        return {
          name: 'search',
          query: { query: '', qf: `TYPE:"${itemType}"` }
        };
      }
    }
  };
</script>
