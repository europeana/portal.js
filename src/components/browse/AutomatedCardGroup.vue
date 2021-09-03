<template>
  <div
    v-if="entries.length > 0"
  >
    <ContentCardSection
      :section="contentCardSection"
    />
  </div>
</template>

<script>
  import ContentCardSection from './ContentCardSection';

  const FEATURED_TOPICS = 'Featured topics';
  const FEATURED_TIMES = 'Featured centuries';
  const RECENT_ITEMS = 'Recent items';

  export default {
    name: 'AutomatedCardGroup',

    components: {
      ContentCardSection
    },

    props: {
      sectionType: {
        type: String,
        required: true
      }
    },

    fetch() {
      if (process.server) {
        return import('@/server-middleware/api/dailyEntries')
          .then(module => {
            return module.entriesOfTheDay(this.type, this.$config)
              .then(entries => {
                this.entries = entries;
              });
        });
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
          }
        };
      },
      type() {
        switch (this.sectionType) {
        case FEATURED_TOPICS:
          return 'topic';
        case FEATURED_TIMES:
          return 'time';
        case RECENT_ITEMS:
          return 'item';
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
        default:
          return null;
        }
      },
      apiEndpoint() {
        switch (this.sectionType) {
        case FEATURED_TOPICS:
          return '/_api/entities/topics';
        case FEATURED_TIMES:
          return '/_api/entities/times';
        case RECENT_ITEMS:
          return '/_api/items/recent';
        default:
          return null;
        }
      }
    }
  };
</script>
