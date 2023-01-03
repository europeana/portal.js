<template>
  <b-card
    v-if="relatedGalleries.length > 0"
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
        // Default to an empty string (rather than `null`), to ensure that only
        // localised related editorial is returned.
        default: ''
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
  .related-galleries-card {
    background: none;
    border: none;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    .card-body {
      padding: 0;
    }
  }

  .related-gallery-card {
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }

    ::v-deep .card-img {
      width: 45%;
      max-width: 80px;
    }
  }
</style>
