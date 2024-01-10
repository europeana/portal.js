<template>
  <div
    class="landing-automated-card-group"
    :class="variant"
  >
    <b-col class="card-group-header col-lg-8 px-0 text-center mx-auto">
      <h3 class="title">
        {{ title }}
      </h3>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="text"
        class="text mb-3"
        v-html="parseMarkdownHtml(text)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </b-col>
    <div
      v-if="hasPartCollectionItems.length"
      class="card-group-wrapper d-flex flex-wrap justify-content-center"
    >
      <InfoCard
        v-for="(item, index) in hasPartCollectionItems"
        :key="index"
        :info="item.info"
        :label="item.label"
        class="px-1 px-md-3"
      />
    </div>
    <SmartLink
      v-if="moreButton"
      :destination="moreButton.url"
      class="btn btn-primary"
      data-qa="section more button"
    >
      {{ moreButton.text }}
    </SmartLink>
  </div>
</template>

<script>
  import InfoCard from '@/components/generic/InfoCard';
  import parseMarkdownHtmlMixin from '@/mixins/parseMarkdownHtml';

  const EUROPEANA_NUMBERS = 'Europeana numbers';

  export default {
    name: 'LandingAutomatedCardGroup',

    components: {
      InfoCard,
      SmartLink: () => import('@/components/generic/SmartLink')
    },

    mixins: [parseMarkdownHtmlMixin],

    props: {
      /**
       * Headline can be used as title
       */
      headline: {
        type: String,
        default: null
      },
      /**
       * Text to accompany the card group
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Genre that identifies the type of data to be fetched and displayed
       */
      genre: {
        type: String,
        default: null
      },
      /**
       * Link button to direct to related content
       */
      moreButton: {
        type: Object,
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
       * @values pro, ds4ch
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
        data.title = this.headline || this.$t('landing.europeanaNumbers');
      }
      return data;
    },
    async fetch() {
      if (this.genre === EUROPEANA_NUMBERS) {
        const cachedData = await this.fetchCachedData();
        for (const key of this.keys) {
          const entry = {};
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
        } else if (this.staticItems.length) {
          items = this.staticItems;
        }
        return items || [];
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

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';

  .landing-automated-card-group.ds4ch {
    margin-top: 3rem;
    text-align: center;

    @media(min-width: $bp-4k) {
      margin-top: 16rem;
    }

    .card-group-header {
      margin-bottom: 2rem;

      @media(min-width: $bp-4k) {
        margin-bottom: 16rem;
      }

      &.col-lg-8 {
        @media(min-width: $bp-4k) {
          max-width: none;
        }
      }
    }

    .card-group-wrapper {
      margin-bottom: 2rem;

      @media(min-width: $bp-4k) {
        margin-bottom: 16rem;
      }
    }

    h3.title {
      @extend %title-3;

      @media(min-width: $bp-4k) {
        margin-bottom: 4rem;
      }
    }

    ::v-deep p {
      @media(min-width: $bp-medium) {
        font-size: $font-size-medium;
      }

      @media(min-width: $bp-4k) {
        font-size: 3.3125rem;
      }
    }

    ::v-deep .info-card {
      max-width: none;
      .card-title {
        font-family: $font-family-montserrat;
        font-size: $font-size-medium !important;
        font-weight: 700;
        line-height: 1.2 !important;
        color: $black;

        @media(min-width: $bp-medium) {
          font-size: $font-size-xl !important;
        }

        @media(min-width: $bp-4k) {
          font-size: 5.625rem !important;
          margin-bottom: 2.625rem;
        }
      }

      .card-text {
        font-family: $font-family-montserrat;
        font-size: $font-size-extrasmall !important;
        font-weight: 600 !important;

        @media(min-width: $bp-4k) {
          font-size: 2rem !important;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <LandingAutomatedCardGroup
      :staticItems="[ { info: '16,000 +', label: 'Visits per day' }, { info: '57,000,000 +', label: 'Items' }, { info: '2,600 +', label: 'Providing institutions' } ]"
    />
  ```
</docs>
