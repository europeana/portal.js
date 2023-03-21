<template>
  <div
    v-if="themesData.length"
  >
    <EntityBadges
      :title="$t('related.themes.title')"
      :related-collections="themesData"
    />
  </div>
</template>

<script>
  import EntityBadges from '../entity/EntityBadges';
  import themeDefinitions from '@/plugins/europeana/themes';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'ThemeBadges',

    components: {
      EntityBadges
    },

    props: {
      themes: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        themesData: []
      };
    },

    async fetch() {
      const contentfulVariables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        identifiers: this.themes
      };

      const contentfulResponse = await this.$contentful.query('themesById', contentfulVariables);

      this.themesData = contentfulResponse.data.data.themePageCollection.items.map(theme => ({
        prefLabel: theme.name,
        url: this.$path({
          name: 'themes-all',
          params: {
            pathMatch: theme.identifier
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
