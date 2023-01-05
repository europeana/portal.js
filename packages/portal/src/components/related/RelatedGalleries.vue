<template>
  <b-card
    v-show="relatedGalleries.length > 0"
    class="related-galleries-card mb-4"
  >
    <b-card-title
      tag="h2"
      class="related-heading text-uppercase"
    >
      {{ $t('related.galleries.title') }}
    </b-card-title>
    <b-card-group>
      <ContentCard
        v-for="(gallery) in relatedGalleries"
        :key="gallery.slug"
        :title="gallery.title"
        :url="{ name: 'galleries-all', params: { pathMatch: gallery.slug } }"
        :image-url="gallery.thumbnail"
        variant="mini"
        class="related-gallery-card"
      />
    </b-card-group>
  </b-card>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import { getLabelledSlug } from '@/plugins/europeana/utils';

  export default {
    name: 'RelatedGalleries',

    components: {
      ContentCard
    },

    props: {
      /**
       * search query
      */
      query: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        relatedGalleries: []
      };
    },

    async fetch() {
      if (!this.query) {
        return;
      }

      const searchParams = {
        query: this.query,
        qf: 'visibility:published',
        pageSize: 3,
        page: 0,
        profile: 'standard'
      };

      const setResponse = await this.$apis.set.search(searchParams, { withMinimalItemPreviews: true });
      this.relatedGalleries = setResponse.data.items ? this.parseSets(setResponse.data.items) : [];
    },

    watch: {
      query: '$fetch'
    },

    methods: {
      parseSets(sets) {
        return sets.map(set => {
          return {
            slug: getLabelledSlug(set.id, set.title.en),
            title: set.title,
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

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .related-galleries-card {
    background: none;
    border: none;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    .card-body {
      padding: 0 !important;
    }

    .card-group {
      @media (min-width: $bp-medium) {
        flex-wrap: nowrap;
      }
    }
  }

  .related-gallery-card {
    margin: 0 0 0.75rem 0;

    ::v-deep .card-img {
      width: 45%;
      max-width: 80px;
    }
  }

  .card-group-list .related-gallery-card {
    @media (min-width: $bp-medium) {
      flex: 0 1 33%;
      margin: 0 0.75rem 0 0;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .masonry-container {
    .related-galleries-card .card-group {
      flex-direction: column;
    }

    .related-gallery-card {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

</style>
