<template>
  <div
    v-if="optionsAndThemes.length"
    class="quick-search"
    data-qa="quick-search"
  >
    <ThemeBadges
      :title="$t('header.quickSearch')"
      :themes="optionsAndThemes"
    />
  </div>
</template>

<script>
  import ThemeBadges from '../theme/ThemeBadges';
  import themesGraphql from '@/graphql/queries/themes.graphql';
  import themeDefinitions from '@/utils/europeana/themes';

  export default {
    name: 'SearchThemeBadges',

    components: {
      ThemeBadges
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
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const contentfulResponse = await this.$contentful.query(themesGraphql, contentfulVariables);

      this.themes = contentfulResponse.data?.themePageCollection?.items.map(theme => ({
        prefLabel: theme.name,
        url: {
          name: 'search',
          query: {
            qf: `collection:${this.qf(theme.identifier)}`
          }
        },
        primaryImageOfPage: theme.primaryImageOfPage
      }));
    },

    computed: {
      optionsAndThemes() {
        return this.options.concat(this.themes);
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
  @import '@europeana/style/scss/variables';

  .quick-search {
    border-top: 1px solid $middlegrey;
    padding: 0.75rem 0;

    @media (min-width: $bp-4k) {
      border-top-width: 2px;
      padding: calc(1.5 * 0.75rem) 0;
    }

    .related-themes {
      max-width: 100%;

      ::v-deep .badge-pill {
        flex-shrink: 0;

        @media (min-width: $bp-4k) {
          margin-right: 0.75rem;
          margin-bottom: 0.75rem;
        }
      }

      ::v-deep .badges-wrapper {
        margin-top: 1rem;
        padding: 0 15px;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */

        @media (min-width: $bp-4k) {
          margin-top: 1.5rem;
          padding: 0 calc(1.5 * 15px);
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

      @media (min-width: $bp-4k) {
        font-size: $font-size-extrasmall-4k;
        padding: 0 calc(1.5 * 15px);
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <SearchThemeBadges
    :options="[
      {
        primaryImageOfPage: {
          image: {
            url: 'https://images.ctfassets.net/i01duvb6kq77/5cZngU4uZxJ2AoN0ya76h/3a190c621e89bb50ccbc78b86e661f4c/StudioInterior.jpg'
          }
        },
        prefLabel: 'Art',
        url: 'https://www.europeana.eu/en/themes/art'
        },
        {
        primaryImageOfPage: {
          image: {
            url: 'https://images.ctfassets.net/i01duvb6kq77/4U2K7lU4mYwQBMX7xL7p4b/124d66feb71444696433413ae230290a/Tropaeolum_cv'
          }
        },
        prefLabel: 'Natural history',
        url: 'https://www.europeana.eu/en/themes/natural-history'
      }]"
  />
  ```
</docs>
