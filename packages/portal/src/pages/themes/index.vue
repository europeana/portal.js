<template>
  <div class="page white-page xxl-page">
    <b-container
      data-qa="themes"
    >
      <ContentHeader
        :title="pageMeta.title"
        :description="$t('themes.description')"
        :media-url="pageMeta.ogImage"
        button-variant="secondary"
        class="half-col"
      />
      <b-row class="flex-md-row pb-5">
        <b-col cols="12">
          <b-card-group
            class="card-deck-4-cols"
            deck
            data-qa="theme section"
          >
            <ContentCard
              v-for="theme in themes"
              :key="theme.identifier"
              :title="theme.name"
              :url="{ name: 'themes-all', params: { pathMatch: theme.identifier } }"
              :image-url="imageUrl(theme.primaryImageOfPage)"
              :image-content-type="imageContentType(theme.primaryImageOfPage)"
              :image-optimisation-options="{ width: 510 }"
              :image-alt="imageAlt(theme.primaryImageOfPage)"
              :texts="[theme.description]"
              :show-subtitle="false"
            />
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import ContentCard from '@/components/content/ContentCard';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'ThemesIndexPage',
    components: {
      ContentHeader,
      ContentCard
    },
    mixins: [pageMetaMixin],

    data() {
      return {
        themes: []
      };
    },

    async fetch() {
      const variables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };
      const response = await this.$contentful.query('themes', variables);
      this.themes = response.data.data.themePageCollection.items;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$tc('themes.themes', 2),
          description: this.$t('themes.description'),
          ogImage: this.socialMediaImage?.url,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      socialMediaImage() {
        return this.themes[0]?.primaryImageOfPage?.image;
      }
    },
    methods: {
      imageUrl(image) {
        return image?.image?.url;
      },
      imageContentType(image) {
        return image?.image?.contentType;
      },
      imageAlt(image) {
        return image?.image?.description || '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .page {
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: -1rem;

    @media (min-width: $bp-4k) {
      padding-bottom: 1.5rem;
      padding-top: 1.5rem;
      margin-top: -1.5rem;
    }
  }
</style>
