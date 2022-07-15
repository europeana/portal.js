<template>
  <div
    v-if="optionsAndThemes.length"
    class="quick-search"
    data-qa="quick-search"
  >
    <RelatedCollections
      :title="$t('header.quickSearch')"
      :related-collections="optionsAndThemes"
    />
  </div>
</template>

<script>
  import RelatedCollections from '../related/RelatedCollections';
  import allThemes from '@/mixins/allThemes';

  export default {
    name: 'QuickSearch',

    components: {
      RelatedCollections
    },

    mixins: [allThemes],

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
      await this.fetchAllThemes();
    },

    computed: {
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
    padding: 0.75rem 0;

    .related-collections {
      max-width: 100%;

      &.container {
        padding: 0;
      }

      ::v-deep .badge-pill {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        flex-shrink: 0;
      }

      ::v-deep .badges-wrapper {
        margin-top: 1rem;
        padding: 0 15px;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    ::v-deep .related-heading {
      font-size: $font-size-extrasmall;
      padding: 0 15px;
      text-align: left;
    }
  }
</style>

<docs lang="md">
  ```jsx
  <QuickSearch
    :options="[
      {
      id: 'http://data.europeana.eu/concept/48',
      isShownBy: { thumbnail: 'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DRP-F-2000-21-40&type=IMAGE' },
      prefLabel: { en: 'photograph' }
      },
      {
      id: 'http://data.europeana.eu/concept/55',
      isShownBy: { thumbnail:
        'https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=https%3A%2F%2Fimages.memorix.nl%2Frce%2Fthumb%2Ffullsize%2Fa63716bf-0a46-ce14-f30a-9f2760f46e75.jpg&type=IMAGE'
      },
      prefLabel: { en: 'Textile' }
      }]"
  />
  ```
</docs>
