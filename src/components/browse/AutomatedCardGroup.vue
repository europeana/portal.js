<template>
  <div
    v-if="entries.length > 0"
  >
    <InfoCardSection
      v-if="type === 'itemCountsMediaType'"
      :section="contentCardSection"
    />
    <ContentCardSection
      v-else
      :section="contentCardSection"
    />
  </div>
</template>

<script>
  import ContentCardSection from './ContentCardSection';
  import InfoCardSection from './InfoCardSection';

  const FEATURED_TOPICS = 'Featured topics';
  const FEATURED_TIMES = 'Featured centuries';
  const RECENT_ITEMS = 'Recent items';
  const ITEM_COUNTS_MEDIA_TYPE = 'Item counts by media type';

  export default {
    name: 'AutomatedCardGroup',

    components: {
      ContentCardSection,
      InfoCardSection
    },

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

    fetch() {
      if (process.server) {
        switch (this.sectionType) {
          case FEATURED_TOPICS:
          case FEATURED_TIMES:
            return import('@/server-middleware/api/daily/index.js')
              .then(module => {
                return module.entriesOfTheDay(this.type, this.$config)
                  .then(entries => {
                    this.entries = entries;
                  })
              });
          case RECENT_ITEMS:
          case ITEM_COUNTS_MEDIA_TYPE:
            return import('@/server-middleware/api/cache/index.js')
              .then(module => {
                return module.cached(this.type, this.$config)
                  .then(entries => {
                    this.entries = entries;
                  })
              });
        }
      }
      return this.$axios.get(this.apiEndpoint)
        .then(response => {
          this.entries = response.data;
        });
    },

    data: () => ({
      entries: []
    }),

    computed: {
      contentCardSection() {
        if (this.sectionType === ITEM_COUNTS_MEDIA_TYPE) {
          return {
            type: this.type,
            hasPartCollection: {
              items: this.entries?.map(entry => ({
                __typename: this.cardType,
                url: this.searchFromType(entry.label),
                info: this.$i18n.n(entry.count),
                label: this.$t(`facets.TYPE.options.${entry.label}`),
                image: this.infoImageFromType(entry.label)
              }))
            },
            moreButton: this.moreButton
          };
        }
        return {
          headline: this.$i18n.t(`automatedCardGroup.${this.type}`),
          hasPartCollection: {
            items: this.entries?.map(entry => ({
              __typename: this.cardType,
              name: entry.prefLabel,
              identifier: entry.id,
              image: entry.isShownBy?.thumbnail,
              encoding: entry
            }))
          },
          moreButton: this.moreButton
        };
      },
      type() {
        switch (this.sectionType) {
        case FEATURED_TOPICS:
          return 'collections/topics';
        case FEATURED_TIMES:
          return 'collections/times';
        case RECENT_ITEMS:
          return 'items/recent';
        case ITEM_COUNTS_MEDIA_TYPE:
          return 'items/mediaTypeCounts';
        default:
          return null;
        }
      },
      cardType() {
        switch (this.sectionType) {
        case FEATURED_TOPICS:
        case FEATURED_TIMES:
          return 'AutomatedEntityCard';
        case RECENT_ITEMS:
          return 'AutomatedRecordCard';
        case ITEM_COUNTS_MEDIA_TYPE:
          return 'InfoCard';
        default:
          return null;
        }
      },
      apiEndpoint() {
        switch (this.sectionType) {
        case FEATURED_TOPICS:
          return '/_api/daily/collections/topics';
        case FEATURED_TIMES:
          return '/_api/daily/collections/times';
        case RECENT_ITEMS:
          return '/_api/cache/items/recent';
        case ITEM_COUNTS_MEDIA_TYPE:
          return '/_api/cache/items/mediaTypeCounts';
        default:
          return null;
        }
      }
    },

    methods: {
      infoImageFromType(type) {
        return `ic-${type.toLowerCase()}`;
      },
      searchFromType(type) {
        return {
          name: 'search',
          query: { query: '', qf: `TYPE:"${type}"` }
        };
      }
    }
  };
</script>
