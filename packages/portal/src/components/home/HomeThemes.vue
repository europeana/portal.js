<template>
  <StackedCardsSwiper
    v-if="themes.length > 0"
    :slides="themes"
    :title="$t('homePage.themesTitle')"
    :cta="{ url: $path('/collections'), text: $t('homePage.themesCTA') }"
  />
</template>

<script>
  import StackedCardsSwiper from '../generic/StackedCardsSwiper';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'HomeThemes',

    components: {
      StackedCardsSwiper
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
        title: langMapValueForLocale(theme.name, this.$i18n.locale).values[0],
        description: langMapValueForLocale(theme.description, this.$i18n.locale).values[0],
        url: this.$path({
          name: 'themes-all', params: {
            pathMatch: theme.identifier
          }
        }),
        image: theme.primaryImageOfPage?.image
      })).sort((a, b) => a.title.localeCompare(b.title));
    }
  };
</script>
