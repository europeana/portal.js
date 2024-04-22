<template>
  <!-- TODO: Use SetCardGroup and clean up methods -->
  <ContentHubPage
    data-qa="galleries"
    :page-meta="pageMeta"
    :items="galleries"
    :total="total"
    :per-page="perPage"
    card-url-name="exhibitions-exhibition"
  />
</template>

<script>
  import { getLabelledSlug } from '@/plugins/europeana/utils';
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 20;

  export default {
    name: 'GalleriesIndexPage',
    components: {
      ContentHubPage
    },
    mixins: [pageMetaMixin],
    middleware: 'sanitisePageQuery',
    data() {
      return {
        galleries: [],
        perPage: PER_PAGE,
        total: 0
      };
    },
    async fetch() {
      const searchParams = {
        query: 'visibility:published',
        qf: `lang:${this.$i18n.locale}`,
        pageSize: PER_PAGE,
        page: this.page - 1,
        profile: 'standard'
      };

      const setResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      this.galleries = setResponse.data.items && this.parseSets(setResponse.data.items);
      this.total = setResponse.data.partOf.total;
      this.perPage = PER_PAGE;

      this.$scrollTo?.('#header');
    },
    computed: {
      pageMeta() {
        return {
          title: this.$tc('galleries.galleries', 2),
          description: this.$t('galleries.description'),
          ogImage: this.socialMediaImage
        };
      },
      socialMediaImage() {
        return this.galleries[0]?.thumbnail;
      },
      page() {
        return Number(this.$route.query.page || 1);
      }
    },
    watch: {
      '$route.query.page': '$fetch'
    },
    methods: {
      parseSets(sets) {
        return sets.map(set => {
          return {
            slug: getLabelledSlug(set.id, set.title.en),
            title: set.title,
            description: set.description,
            thumbnail: this.setPreviewUrl(set.items?.[0].edmPreview)
          };
        });
      },
      setPreviewUrl(edmPreview) {
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      }
    }
  };
</script>
