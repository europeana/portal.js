<template>
  <aside
    v-show="relatedGalleries.length > 0"
    :aria-label="$t('related.galleries.name')"
  >
    <b-card
      class="related-galleries-card mb-4"
    >
      <b-card-title
        title-tag="h2"
        class="related-heading text-uppercase"
      >
        {{ $t('related.galleries.title') }}
      </b-card-title>
      <!-- TODO: use SetCardGroup and clean up methods -->
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
  </aside>
</template>

<script>
  import ContentCard from '../content/ContentCard';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';

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
      },
      overrides: {
        type: Array,
        default: null
      }
    },

    data() {
      return {
        relatedGalleries: []
      };
    },

    async fetch() {
      if (this.overrides) {
        this.relatedGalleries = this.overrides;
      } else if (this.query && (this.query !== '') && !this.query.includes(':')) {
        const searchParams = {
          query: this.query,
          qf: ['visibility:published', `lang:${this.$i18n.locale}`],
          pageSize: 3,
          page: 1,
          profile: 'items.meta'
        };

        const setResponse = await this.$apis.set.search(searchParams);
        this.relatedGalleries = setResponse.items ? this.parseSets(setResponse.items) : [];

        this.$emit('fetched', this.relatedGalleries);
      }
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

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .related-galleries-card {
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
      max-width: 5rem;

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          max-width: 7.5rem;
        }
      }
    }
  }

  .card-group-list .related-gallery-card {
    @media (min-width: $bp-medium) {
      flex: 0 1 33%;
      margin: 0 0.75rem 0.75rem 0;

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          margin-right: 1.125rem;
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .masonry-container {
    .related-galleries-card .card-group {
      flex-direction: column;
    }
  }

</style>
