<template>
  <div
    v-if="entries && entries.length > 0"
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

  // TODO: there are too many switch/case statements on sectionType here;
  //       refactor e.g. to have those computed properties be props instead
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
            return import('@/server-middleware/api/collections/index.js')
              .then(module => {
                return module.cachedCollections(
                  this.type.replace('collections/', ''), this.$config, { featured: true, locale: this.$i18n.locale }
                )
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

    data() {
      const data = {
        entries: []
      };

      if (this.sectionType === FEATURED_TOPICS) {
        data.apiEndpoint = '/_api/collections/topics?featured=true';
        data.type = 'collections/topics';
        data.cardType = 'AutomatedEntityCard';
      } else if (this.sectionType === FEATURED_TIMES) {
        data.apiEndpoint = '/_api/collections/times?featured=true';
        data.type = 'collections/times';
        data.cardType = 'AutomatedEntityCard';
      } else if (this.sectionType === RECENT_ITEMS) {
        data.apiEndpoint = '/_api/cache/items/recent';
        data.type = 'items/recent';
        data.cardType = 'AutomatedRecordCard';
      } else if (this.sectionType === ITEM_COUNTS_MEDIA_TYPE) {
        data.apiEndpoint = '/_api/cache/items/typeCounts';
        data.type = 'items/typeCounts';
        data.cardType = 'InfoCard';
      }

      return data;
    },

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
