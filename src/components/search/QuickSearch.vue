<template>
  <div
    v-if="optionsAndThemes.length"
    class="quick-search"
    data-qa="quick-search"
  >
    <RelatedCollections
      :title="$t('header.quickSearch')"
      :related-collections="optionsAndThemes"
      chips-wrapper-class="quick-search-chips"
      chips-ref="options"
    />
  </div>
</template>

<script>
  import RelatedCollections from '../generic/RelatedCollections';
  import { getEntityUri } from '@/plugins/europeana/entity';
  import themes from '@/plugins/europeana/themes';
  import { mapState } from 'vuex';

  export default {
    name: 'QuickSearch',

    components: {
      RelatedCollections
    },

    props: {
      /**
       * Array of objects for the quick search badge links.
       * Currently used for styleguide and concatenated by allThemes fetch.
       */
      options: {
        type: Array,
        default: () => []
      }
    },

    async fetch() {
      if (this.allThemes.length === 0) {
        const themesURIs = themes.map(theme => getEntityUri('topic', theme.id));
        const allThemesFromAPI = await this.$apis.entity.find(themesURIs);
        this.$store.commit('search/set', ['allThemes', allThemesFromAPI]);
      }
    },

    computed: {
      ...mapState({ allThemes: state => state.search.allThemes }),
      optionsAndThemes() {
        return this.options.concat(this.allThemes);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .quick-search {
    border-top: 1px solid $middlegrey;
    padding: 0.75rem 1.25rem 1.25rem;
  }
</style>

<docs lang="md">
  ```jsx
  <QuickSearch
    :options="[
      {
      id: 'http://data.europeana.eu/concept/base/48',
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DRP-F-2000-21-40&type=IMAGE' },
      prefLabel: { en: 'photograph' }
      },
      {
      id: 'http://data.europeana.eu/concept/base/55',
      isShownBy: { thumbnail:
        'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fimages.memorix.nl%2Frce%2Fthumb%2Ffullsize%2Fa63716bf-0a46-ce14-f30a-9f2760f46e75.jpg&type=IMAGE'
      },
      prefLabel: { en: 'Textile' }
      }]"
  />
  ```
</docs>
