<template>
  <div
    class="landing-automated-card-group"
    :class="variant"
  >
    <b-col class="col-lg-8 px-0 text-center mx-auto">
      <h3
        v-if="title"
        class="title"
      >
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
        :variant="cardVariant"
      />
    </div>
  </div>
</template>

<script>
  import camelCase from 'lodash/camelCase.js';
  import InfoCard from '@/components/generic/InfoCard';

  const EUROPEANA_NUMBERS = 'Europeana numbers';

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
      },
      /**
       * Variant to define layout and style
       * @values pro
       */
      variant: {
        type: String,
        default: 'pro'
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
      if (this.keys) {
        const cachedData = await this.fetchCachedData();

        for (const key of this.keys) {
          const entry = {
            info: cachedData[key],
            label: camelCase(key.split('/').pop())
          };
          if (key === 'items/type-counts') {
            entry.label = 'items';
            entry.info = cachedData[key]?.map(data => data.count).reduce((a, b) => a + b);
          } else if (key === 'collections/organisations/count') {
            entry.label = 'providingInstitutions';
          }
          this.entries.push(entry);
        }
      }
    },
    computed: {
      hasPartCollectionItems() {
        let items;

        if (this.staticItems.length) {
          items = this.staticItems;
        } else {
          items = this.entries?.map(entry => ({
            info: isNaN(entry.info) ? entry.info : this.$i18n.n(this.roundedNumber(entry.info)) + ' +',
            label: this.$t(`landing.counts.${entry.label}`)
          }));
        }

        return items || [];
      },
      cardVariant() {
        return this.variant === 'pro' ? 'dark' : 'default';
      }
    },
    methods: {
      fetchCachedData() {
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
    margin-bottom: 2rem;
    margin-right: auto;
    margin-left: auto;
    max-width: $max-text-column-width;

    @media (min-width: $bp-large) {
      margin-bottom: 4rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: 13rem;
      max-width: 2000px;
    }

    ::v-deep .info-card {
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      @media (min-width: $bp-small) {
        flex-basis: 50%;
      }

      @media (min-width: $bp-medium) {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      @media (min-width: $bp-large) {
        flex-basis: auto;
      }

      @media (min-width: $bp-4k) {
        max-width: none;
        padding-left: 2rem;
        padding-right: 2rem;
      }

      .card-title {
        @extend %title-2;
        margin-bottom: 0.875rem;

        @media (min-width: $bp-medium) {
          margin-bottom: 1rem;
          white-space: nowrap;
        }
      }

      .card-text {
        @extend %title-5;
        color: $darkgrey;
        max-width: 145px;

        @media (min-width: $bp-small) {
          max-width: 200px;
        }

        @media (min-width: $bp-4k) {
          max-width: 510px;
        }
      }

      .card-body {
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: $bp-small) {
          padding: 1rem;
        }

        @media (min-width: $bp-large) {
          padding: 2rem;
        }
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
