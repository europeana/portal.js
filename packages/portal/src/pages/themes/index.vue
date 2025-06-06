<template>
  <ContentHubPage
    data-qa="themes"
    :title="pageMeta.title"
    :description="pageMeta.description"
    :media-url="pageMetaOgImage"
    :items="themes"
    :total="total"
    :per-page="perPage"
    card-url-name="themes-all"
  />
</template>

<script>
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import themesGraphql from '@/graphql/queries/themes.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 24;

  export default {
    name: 'ThemesIndexPage',

    components: {
      ContentHubPage
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        themes: [],
        total: 0,
        perPage: PER_PAGE
      };
    },

    async fetch() {
      const variables = {
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };
      const response = await this.$contentful.query(themesGraphql, variables);
      this.themes = response.data.data.themePageCollection.items;
      this.total = response.data.data.themePageCollection.total;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$tc('themes.themes', 2),
          description: this.$t('themes.description'),
          ogImage: this.socialMediaImage,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      socialMediaImage() {
        return this.themes[0]?.primaryImageOfPage?.image;
      }
    }
  };
</script>
