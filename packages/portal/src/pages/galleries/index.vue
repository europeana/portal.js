<template>
  <b-container>
    <ContentHeader
      :title="pageMeta.title"
      :description="$t('galleries.description')"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
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
        <b-card-group
          v-else
          class="card-deck-4-cols"
          deck
          data-qa="gallery foyer"
        >
          <ContentCard
            v-for="(gallery, index) in galleries"
            :key="gallery.slug"
            :title="gallery.title"
            :url="{ name: 'galleries-all', params: { pathMatch: gallery.slug } }"
            :image-url="gallery.thumbnail"
            :texts="[gallery.description]"
            :show-subtitle="false"
            :offset="index"
          />
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PaginationNavInput
          :total-results="total"
          :per-page="perPage"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { getLabelledSlug } from '@europeana/apis/src/utils.js';
  import ContentHeader from '../../components/generic/ContentHeader';
  import ContentCard from '../../components/generic/ContentCard';
  import pageMetaMixin from '@/mixins/pageMeta';

  const PER_PAGE = 20;

  export default {
    name: 'GalleriesIndexPage',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      ContentCard,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      PaginationNavInput: () => import('../../components/generic/PaginationNavInput')
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

      this.$scrollTo && this.$scrollTo('#header');
    },
    computed: {
      pageMeta() {
        return {
          title: this.$tc('galleries.galleries', 2)
        };
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
