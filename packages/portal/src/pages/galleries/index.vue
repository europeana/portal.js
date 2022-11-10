<template>
  <b-container>
    <ContentHeader
      :title="$tc('galleries.galleries', 2)"
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
        <b-card-group
          v-else
          class="card-deck-4-cols"
          deck
          data-qa="gallery foyer"
        >
          <template
            v-if="setGalleriesEnabled"
          >
            <ContentCard
              v-for="gallery in galleries"
              :key="gallery.slug"
              :title="gallery.title"
              :url="{ name: 'galleries-all', params: { pathMatch: gallery.slug } }"
              :image-url="gallery.thumbnail"
              :texts="[gallery.description]"
              :show-subtitle="false"
            />
          </template>
          <template
            v-else
          >
            <ContentCard
              v-for="gallery in galleries"
              :key="gallery.identifier"
              :title="gallery.name"
              :url="{ name: 'galleries-all', params: { pathMatch: gallery.identifier } }"
              :image-url="gallery.hasPartCollection.items[0] && imageUrl(gallery.hasPartCollection.items[0])"
              :texts="[gallery.description]"
              :show-subtitle="false"
            />
          </template>
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
  import { getLabelledSlug } from '@/plugins/europeana/utils';
  import ContentHeader from '../../components/generic/ContentHeader';
  import ContentCard from '../../components/generic/ContentCard';
  import pageMixin from '@/mixins/page';

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
    mixins: [pageMixin],
    middleware: 'sanitisePageQuery',
    data() {
      return {
        galleries: [],
        perPage: PER_PAGE,
        total: 0
      };
    },
    async fetch() {
      if (this.setGalleriesEnabled) {
        await this.fetchSetGalleries();
      } else {
        await this.fetchContentfulGalleries();
      }
      this.$scrollTo && this.$scrollTo('#header');
    },
    computed: {
      pageTitle() {
        return this.$tc('galleries.galleries', 2);
      },
      setGalleriesEnabled() {
        return this.$features.setGalleries;
      },
      page() {
        return Number(this.$route.query.page || 1);
      }
    },
    watch: {
      '$route.query.page': '$fetch'
    },
    methods: {
      async fetchSetGalleries() {
        const searchParams = {
          query: 'visibility:published',
          pageSize: PER_PAGE,
          page: this.page - 1,
          profile: 'standard'
        };

        const setResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
        this.galleries = this.parseSets(setResponse.data.items);
        this.total = setResponse.data.partOf.total;
        this.perPage = PER_PAGE;
      },
      parseSets(sets) {
        return sets.map(set => {
          return {
            slug: getLabelledSlug(set.id, set.title.en),
            title: set.title,
            description: set.description,
            thumbnail: this.setPreviewUrl(set.items[0].edmPreview)
          };
        });
      },
      setPreviewUrl(edmPreview) {
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      },

      // TODO: remove when using set galleries
      async fetchContentfulGalleries() {
        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          limit: PER_PAGE,
          skip: (this.$store.state.sanitised.page - 1) * PER_PAGE
        };

        const contentfulResponse = await this.$contentful.query('galleryFoyerPage', variables)
          .then(response => response.data.data)
          .catch((e) => {
            this.error({ statusCode: 500, message: e.toString() });
          });

        this.galleries = contentfulResponse.imageGalleryCollection.items;
        this.total = contentfulResponse.imageGalleryCollection.total;
        this.perPage = PER_PAGE;
      },

      // TODO: remove when using set galleries
      imageUrl(data) {
        const edmPreview = data.encoding?.edmPreview?.[0] || data.thumbnailUrl;
        return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
      }
    }
  };
</script>
