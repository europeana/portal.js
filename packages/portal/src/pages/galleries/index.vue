<template>
  <b-container
    v-if="$fetchState.pending"
    data-qa="loading spinner container"
  >
    <b-row class="flex-md-row py-4 text-center">
      <b-col cols="12">
        <LoadingSpinner />
      </b-col>
    </b-row>
  </b-container>
  <b-container
    v-else-if="$fetchState.error"
    data-qa="alert message container"
  >
    <b-row class="flex-md-row py-4">
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
  </b-container>
  <!-- TODO: Use SetCardGroup and clean up methods -->
  <ContentHubPage
    v-else
    data-qa="galleries"
    :page-meta="pageMeta"
    :items="galleries"
    :total="total"
    :per-page="perPage"
    card-url-name="galleries-all"
  />
</template>

<script>
  import { getLabelledSlug } from '@europeana/utils';
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 24;

  export default {
    name: 'GalleriesIndexPage',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHubPage,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner')
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
      this.galleries = setResponse.items && this.parseSets(setResponse.items);
      this.total = setResponse.partOf.total;
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
