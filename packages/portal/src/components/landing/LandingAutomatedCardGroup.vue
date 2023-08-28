<template>
  <div>
    {{ entries }}
  </div>
</template>

<script>
  const EUROPEANA_NUMBERS = 'Europeana numbers';

  export default {
    name: 'LandingAutomatedCardGroup',

    props: {
      genre: {
        type: String,
        required: true
      }
    },

    data() {
      const data = {
        keys: null,
        cardType: null,
        headline: null,
        contentful: null,
        galleries: null,
        daily: false,
        entries: []
      };

      if (this.genre === EUROPEANA_NUMBERS) {
        data.keys = ['matomo/visits', 'items/type-counts', 'collections/organisations/count'];
        data.headline = this.$i18n.t('automatedCardGroup.europeanaNumbers');
      }
      return data;
    },

    async fetch() {
      this.keys.forEach(async key => {
        const cachedData = await this.fetchCachedData(key);
        this.entries.push({ [key]: cachedData });
      });
    },

    computed: {
      hasPartCollectionItems() {
        let items;

        switch (this.genre) {
        case EUROPEANA_NUMBERS:
          items = this.entries?.map(entry => ({
            __typename: this.cardType,
            url: this.searchFromType(entry.label),
            info: this.$i18n.n(entry.count),
            label: this.$t(`facets.TYPE.options.${entry.label}`),
            image: this.infoImageFromType(entry.label)
          }));
          break;
        default:
          items = [];
        }

        return items;
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
      }
    }
  };
</script>
