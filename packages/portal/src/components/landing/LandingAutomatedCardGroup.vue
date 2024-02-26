<template>
  <div class="landing-automated-card-group">
    <b-col class="col-lg-8 px-0 text-center mx-auto">
      <h3 class="title">
        {{ title }}
      </h3>
    </b-col>
    <div
      v-if="hasPartCollectionItems.length"
      class="d-flex flex-wrap justify-content-center"
    >
      <InfoCard
        v-for="(item, index) in hasPartCollectionItems"
        :key="index"
        :info="item.info"
        :label="item.label"
        class="px-1 px-md-3"
        variant="dark"
      />
    </div>
  </div>
</template>

<script>
  import InfoCard from '@/components/generic/InfoCard';

  const EUROPEANA_NUMBERS = 'Europeana numbers';
  // TODO: update to DS numbers when available in CTF
  const DS4CH_NUMBERS = 'Europeana numbers';

  export default {
    name: 'LandingAutomatedCardGroup',

    components: {
      InfoCard
    },

    props: {
      /**
       * Genre that identifies the type of data to be fetched and displayed
       */
      genre: {
        type: String,
        default: null
      },
      /**
       * List of static items to use in styleguide
       */
      staticItems: {
        type: Array,
        default: () => []
      }
    },
    data() {
      const data = {
        keys: null,
        title: null,
        entries: [],
        ds4chHardCodedCounts: [
          { info: this.$i18n.n(4500),
            label: this.$t('ds4ch.counts.networkMembers') },
          { info: this.$i18n.n(19),
            label: this.$t('ds4ch.counts.partners') },
          { info: '+10%',
            label: this.$t('ds4ch.counts.increaseHighQualityData') }
        ]
      };
      if (this.genre === DS4CH_NUMBERS) {
        data.keys = ['items/type-counts', 'collections/organisations/count'];
      } else if (this.genre === EUROPEANA_NUMBERS) {
        data.keys = ['matomo/visits', 'items/type-counts', 'collections/organisations/count'];
        data.title = this.$t('landing.europeanaNumbers');
      }
      return data;
    },
    async fetch() {
      const cachedData = await this.fetchCachedData();

      for (const key of this.keys) {
        const entry = {};
        if (key === 'items/type-counts') {
          entry.label = 'items';
          entry.count = cachedData[key]?.map(data => data.count).reduce((a, b) => a + b);
        }
        if (key === 'collections/organisations/count') {
          entry.label = 'providingInstitutions';
          entry.count = cachedData[key];
        }
        if (key === 'matomo/visits') {
          entry.label = 'visits';
          entry.count = cachedData[key];
        }
        if (key === 'items/type-counts') {
          entry.label = 'items';
          entry.count = cachedData[key]?.map(data => data.count).reduce((a, b) => a + b);
        }
        if (key === 'collections/organisations/count') {
          entry.label = 'providingInstitutions';
          entry.count = cachedData[key];
        }
        this.entries.push(entry);
      }
    },
    computed: {
      hasPartCollectionItems() {
        let items;

        if (this.staticItems.length) {
          items = this.staticItems;
        } else {
          items = this.entries?.map(entry => ({
            info: this.$i18n.n(this.roundedNumber(entry.count)) + ' +',
            label: this.$t(`landing.counts.${entry.label}`)
          }));

          if (this.genre === DS4CH_NUMBERS) {
            items.splice(1, 0, this.ds4chHardCodedCounts[0]);
            items.push(this.ds4chHardCodedCounts[1], this.ds4chHardCodedCounts[2]);
          }
        }

        return items || [];
      }
    },
    methods: {
      fetchCachedData() {
        if (!this.keys) {
          return Promise.resolve();
        }

        if (process.server) {
          return import('@/server-middleware/api/cache/index.js')
            .then(module => {
              return module.cached(this.keys, this.$config.redis)
                .then((response) => response);
            });
        } else {
          const queryIds = `?id=${this.keys.join('&id=')}`;

          return this.$axios.get(`/_api/cache${queryIds}`, { baseURL: window.location.origin })
            .then((response) => response.data);
        }
      },
      roundedNumber(number) {
        const precision = 2;
        const numberLength = number?.toString().length;
        // Number is always rounded down as a plus (+) is added to the count string.
        const floorRoundedNumber =  Math.floor(number / (10 ** (numberLength - precision))) * (10 ** (numberLength - precision));
        return floorRoundedNumber.toFixed();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .landing-automated-card-group {
    padding-bottom: 1rem;

    @media (min-width: $bp-medium) {
      padding-bottom: 4rem;
    }

  }
  .title {
    font-family: $font-family-ubuntu;
    font-size: $font-size-medium;
    font-weight: 500;

    @media (min-width: $bp-medium) {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    @media (min-width: $bp-4k) {
      font-size: calc(1.5 * 1.75rem);
    }
  }

  ::v-deep .info-card {
    .card-title {
      font-family: $font-family-ubuntu;
      font-size: $font-size-large !important;
      font-weight: 500;
      line-height: 1.5 !important;

      @media (min-width: $bp-medium) {
        font-size: $font-size-xl !important;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl-4k !important;
      }
    }

    .card-text {
      font-size: $font-size-small !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      color: $mediumgrey;

      @media (min-width: $bp-4k) {
        font-size: $font-size-small-4k !important;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <LandingAutomatedCardGroup
        :staticItems="[ { info: '16,000 +', label: 'Visits per day' }, { info: '57,000,000 +', label: 'Items' }, { info: '2,600 +', label: 'Providing institutions' } ]"
      />
    </div>
  ```
</docs>
