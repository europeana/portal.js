<template>
  <div>
    <h3 class="title text-center">
      {{ title }}
    </h3>
    <div
      v-if="hasPartCollectionItems.length"
      class="d-flex flex-wrap justify-content-center"
    >
      <InfoCard
        v-for="(item, index) in hasPartCollectionItems"
        :key="index"
        :info="item.info"
        :label="item.label"
        class="px-md-3"
      />
    </div>
  </div>
</template>

<script>
  import InfoCard from '../generic/InfoCard.vue';

  const EUROPEANA_NUMBERS = 'Europeana numbers';

  export default {
    name: 'LandingAutomatedCardGroup',

    components: {
      InfoCard
    },

    props: {
      genre: {
        type: String,
        default: null
      }
    },
    data() {
      const data = {
        keys: null,
        title: null,
        entries: []
      };
      if (this.genre === EUROPEANA_NUMBERS) {
        data.keys = ['matomo/visits', 'items/type-counts', 'collections/organisations/count'];
        data.title = this.$t('landing.europeanaNumbers');
      }
      return data;
    },
    async fetch() {
      if (this.genre === EUROPEANA_NUMBERS) {
        for (const key of this.keys) {
          const cachedData = await this.fetchCachedData(key);
          const entry = {};
          if (key === 'matomo/visits') {
            entry.label = 'visits';
            entry.count = cachedData;
          }
          if (key === 'items/type-counts') {
            entry.label = 'items';
            entry.count = cachedData.map(data => data.count).reduce((a, b) => a + b);
          }
          if (key === 'collections/organisations/count') {
            entry.label = 'providingInstitutions';
            entry.count = cachedData;
          }
          this.entries.push(entry);
        }
      }
    },
    computed: {
      hasPartCollectionItems() {
        let items;
        if (this.genre === EUROPEANA_NUMBERS) {
          items = this.entries?.map(entry => ({
            info: this.$i18n.n(this.roundedNumber(entry.count)) + ' +',
            label: this.$t(`landing.counts.${entry.label}`)
          }));
        }
        return items || [];
      }
    },
    methods: {
      fetchCachedData(key) {
        if (process.server) {
          return import('@/server-middleware/api/cache/index.js')
            .then(module => {
              return module.cached(key, this.$config.redis);
            });
        } else {
          return this.$axios.get(`/_api/cache/${key}`, { baseURL: window.location.origin })
            .then((response) => response.data);
        }
      },
      roundedNumber(number) {
        const precision = 2;
        const numberLength = number.toString().length;
        // Number is always rounded down as a plus (+) is added to the count string.
        const floorRoundedNumber =  Math.floor(number / (10 ** (numberLength - precision))) * (10 ** (numberLength - precision));
        return floorRoundedNumber.toFixed();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  h3 {
    font-family: $font-family-ubuntu;
    font-size: $font-size-medium;
    font-weight: 500;

    @media (min-width: $bp-medium) {
      font-size: $font-size-large;
    }

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }
  }
</style>
