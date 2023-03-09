<template>
  <div
    v-if="optionsAndThemes.length"
    class="quick-search"
    data-qa="quick-search"
  >
    <EntityBadges
      :title="$t('header.quickSearch')"
      :related-collections="optionsAndThemes"
    />
  </div>
</template>

<script>
  import EntityBadges from '../entity/EntityBadges';
  import themeDefinitions from '@/plugins/europeana/themes';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'QuickSearch',

    components: {
      EntityBadges
    },

    props: {
      /**
       * Array of objects for the quick search badge links.
       * Currently used for styleguide and concatenated by optionsAndThemes.
       */
      options: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        themes: []
      };
    },

    async fetch() {
      const contentfulVariables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };

      const contentfulResponse = await this.$contentful.query('themes', contentfulVariables);

      this.themes = contentfulResponse.data.data.themePageCollection.items.map(theme => ({
        prefLabel: theme.name,
        url: this.$path({
          name: 'search',
          query: {
            qf: `collection:${this.qf(theme.identifier)}`
          }
        }),
        primaryImageOfPage: theme.primaryImageOfPage
      })).sort((a, b) => a.prefLabel.localeCompare(b.prefLabel));
    },

    computed: {
      optionsAndThemes() {
        return this.options.concat(this.alphabeticallySortedThemes);
      },
      alphabeticallySortedThemes() {
        // Slice to make a copy, as sort occurs in place
        return this.themes.slice(0).sort((a, b) =>
          langMapValueForLocale(a.prefLabel, this.$i18n.locale).values[0].localeCompare(langMapValueForLocale(b.prefLabel, this.$i18n.locale).values[0]));
      }
    },

    methods: {
      qf(identifier) {
        return themeDefinitions.find((theme) => theme.id === identifier)?.qf;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .quick-search {
    border-top: 1px solid $middlegrey;
    padding: 0.75rem 0;

    @media (min-width: $bp-xxxl) {
      border-top-width: 0.0625vw;
      padding: 0.75vw 0;
    }

    .related-collections {
      max-width: 100%;

      ::v-deep .badge-pill {
        flex-shrink: 0;

        @media (min-width: $bp-xxxl) {
          margin-right: 0.5vw;
          margin-bottom: 0.5vw;
        }
      }

      ::v-deep .badges-wrapper {
        margin-top: 1rem;
        padding: 0 15px;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */

        @media (min-width: $bp-xxxl) {
          margin-top: 1vw;
          padding: 0 1vw;
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    ::v-deep .related-heading {
      font-size: $font-size-extrasmall;
      padding: 0 15px;
      text-align: left;

      @media (min-width: $bp-xxxl) {
        font-size: $responsive-font-size-extrasmall;
        padding: 0 1vw;
      }
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
