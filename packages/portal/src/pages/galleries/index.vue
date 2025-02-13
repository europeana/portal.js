<template>
  <LoadingSpinner
    v-if="$fetchState.pending"
    class="flex-md-row py-4 text-center"
  />
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
    :title="pageMeta.title"
    :description="pageMeta.description"
    :media-url="pageMetaOgImage"
    :items="galleries"
    :total="total"
    :per-page="perPage"
    card-url-name="galleries-all"
  />
</template>

<script>
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';
  import ContentHubPage from '@/components/content/ContentHubPage.vue';
  import pageMetaMixin from '@/mixins/pageMeta';
  import useScrollTo from '@/composables/scrollTo.js';

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
    setup() {
      const { scrollToSelector } = useScrollTo();
      return { scrollToSelector };
    },
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
        profile: 'items.meta'
      };

      const setResponse = await this.$apis.set.search(searchParams);
      this.galleries = setResponse.items && this.parseSets(setResponse.items);
      this.total = setResponse.partOf.total;
      this.perPage = PER_PAGE;
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
      async '$route.query.page'() {
        await this.$fetch();
        this.scrollToSelector('#header');
      }
    },
    methods: {
      parseSets(sets) {
        return sets.map(set => {
          return {
            slug: getLabelledSlug(set.id, set.title.en),
            title: set.title,
            description: set.description,
            thumbnail: this.setPreviewUrl(set.isShownBy?.thumbnail)
          };
        });
      },
      setPreviewUrl(edmPreview) {
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      }
    }
  };
</script>
