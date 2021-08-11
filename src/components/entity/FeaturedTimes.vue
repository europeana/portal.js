<template>
  <div
    v-if="times.length > 0"
  >
    <ContentCardSection
      :section="contentCardSection"
    />
  </div>
</template>

<script>
  import ContentCardSection from '../browse/ContentCardSection';

  export default {
    name: 'HighlightedEntities',

    components: {
      ContentCardSection
    },

    fetch() {
      if (process.server) {
        return require('@/server-middleware/api/entities/dailyEntities')
          .entitiesOfTheDay(this.$config, 'time')
          .then(times => {
            this.times = times;
          });
      } else {
        return this.$axios.get('/_api/entities/times')
          .then(response => {
            this.times = response.data;
          });
      }
    },

    data: () => ({
      times: []
    }),

    computed: {
      contentCardSection() {
        return {
          headline: 'Highlighted centuries',
          hasPartCollection: {
            items: this.times.map(time => ({
              __typename: 'AutomatedEntityCard',
              name: time.prefLabel,
              identifier: time.id,
              image: time.isShownBy?.thumbnail
            }))
          }
        };
      }
    }
  };
</script>
