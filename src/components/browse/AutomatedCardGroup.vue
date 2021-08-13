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
        return require('@/server-middleware/api/dailyEntries').entriesOfTheDay(this.$config, this.type)
          .then(entries => {
            this.entries = entries;
          });
      } else if (this.apiEndpoint) {
        return this.$axios.get(this.apiEndpoint)
          .then(response => {
            this.entries = response.data;
          });
      }
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
        case 'Featured topics':
          return 'topic';
        case 'Featured centuries':
          return 'time';
        case 'Recent items':
          return 'item';
        default:
          return null;
        }
      },
      cardType() {
        switch (this.sectionType) {
        case 'Featured topics':
        case 'Featured centuries':
          return 'AutomatedEntityCard';
        case 'Recent items':
          return 'AutomatedRecordCard';
        default:
          return null;
        }
      },
      apiEndpoint() {
        console.log(this.sectionType);
        switch (this.sectionType) {
        case 'Featured topics':
          return '/_api/entities/topics';
        case 'Featured centuries':
          return '/_api/entities/times';
        case 'Recent items':
          return '/_api/items/recent';
        default:
          return null;
        }
      }
    }
  };
</script>
