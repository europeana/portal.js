<template>
  <StackedCardsSwiper
    v-if="themes.length > 0"
    :slides="themes"
    :title="$t('homePage.themesTitle')"
  />
</template>

<script>
  import StackedCardsSwiper from '../generic/StackedCardsSwiper';
  import themesGraphql from '@/graphql/queries/themes.graphql';

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
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const contentfulResponse = await this.$contentful.query(themesGraphql, contentfulVariables);

      this.themes = contentfulResponse.data.themePageCollection.items.map(theme => ({
        title: theme.name,
        description: theme.description,
        url: this.localePath({
          name: 'themes-all',
          params: {
            pathMatch: theme.identifier
          }
        }),
        image: theme.primaryImageOfPage?.image
      })).sort((a, b) => a.title.localeCompare(b.title));
    }
  };
</script>
