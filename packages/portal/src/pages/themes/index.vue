<template>
  <b-container
    data-qa="themes"
  >
    <ContentHeader
      :title="pageMeta.title"
      :description="$t('themes.description')"
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
</template>

<script>
  import ContentHeader from '../../components/content/ContentHeader';
  import ContentCard from '../../components/content/ContentCard';
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
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };
      const response = await this.$contentful.query('themes', variables);
      this.themes = response.data.data.themePageCollection.items;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$tc('themes.themes', 2),
          description: this.$t('themes.description')
        };
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
