<template>
  <div
    v-if="entries && entries.length > 0"
  >
    <InfoCardSection
      v-if="type === 'items/typeCounts'"
      :section="contentCardSection"
    />
    <ContentCardSection
      v-else
      :section="contentCardSection"
    />
  </div>
</template>

<script>
  import { getWikimediaThumbnailUrl } from '@/plugins/europeana/entity';
  import ContentCardSection from './ContentCardSection';
  import InfoCardSection from './InfoCardSection';

  const FEATURED_ORGANISATIONS = 'Featured organisations';
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
        return import('@/server-middleware/api/cache/index.js')
          .then(module => {
            return module.cached(this.type, this.$config)
              .then(entries => {
                this.entries = entries;
              });
        });
      } else {
        return this.$axios.get(`/_api/cache/${this.type}`)
          .then(response => {
            this.entries = response.data;
          });
      }
    },

    data() {
      const data = {
        entries: []
      };

      if (this.sectionType === FEATURED_ORGANISATIONS) {
        data.type = `${this.$i18n.locale}/collections/organisations/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.organisation');
      } else if (this.sectionType === FEATURED_TOPICS) {
        data.type = `${this.$i18n.locale}/collections/topics/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.topic');
      } else if (this.sectionType === FEATURED_TIMES) {
        data.type = `${this.$i18n.locale}/collections/times/featured`;
        data.cardType = 'AutomatedEntityCard';
        data.headline = this.$i18n.t('automatedCardGroup.time');
      } else if (this.sectionType === RECENT_ITEMS) {
        data.type = 'items/recent';
        data.cardType = 'AutomatedRecordCard';
        data.headline = this.$i18n.t('automatedCardGroup.item');
      } else if (this.sectionType === ITEM_COUNTS_MEDIA_TYPE) {
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
          headline: this.headline,
          hasPartCollection: {
            items: this.entries?.map(entry => ({
              __typename: this.cardType,
              __variant: (this.sectionType === RECENT_ITEMS) ? null : 'mini',
              name: entry.prefLabel,
              identifier: entry.id,
              image: entry.isShownBy?.thumbnail || (entry.logo ? getWikimediaThumbnailUrl(entry.logo.id, 80) : null),
              encoding: entry,
              logo: !!entry.logo
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
