<template>
  <div
    v-if="collections.length"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase">
      {{ title || $t('related.collections.title') }}
    </h2>
    <div
      class="badges-wrapper d-flex"
      :class="{ 'flex-wrap': wrap }"
    >
      <LinkBadge
        v-for="relatedCollection in collections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        ref="options"
        :link-to="collectionLinkGen(relatedCollection)"
        :title="collectionTitle(relatedCollection)"
        :img="imageUrl(relatedCollection, 28, 28)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
        :image-src-set="imageSrcSet(relatedCollection)"
      />
    </div>
  </div>
</template>

<script>
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';

  import europeanaEntityLinks from '@/mixins/europeana/entities/entityLinks';

  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'EntityBadges',

    components: {
      LinkBadge
    },

    mixins: [
      collectionLinkGenMixin,
      europeanaEntityLinks
    ],

    props: {
      title: {
        type: String,
        default: ''
      },
      relatedCollections: {
        type: Array,
        default: () => []
      },
      entityUris: {
        type: Array,
        default: () => []
      },
      badgeVariant: {
        type: String,
        default: 'secondary'
      },
      wrap: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        collections: this.relatedCollections
      };
    },

    async fetch() {
      if (((this.entityUris?.length || 0) === 0) || ((this.relatedCollections?.length || 0) > 0)) {
        return;
      }

      const entities = await this.fetchEntitiesWithEditorialOverrides(this.entityUris);
      if (entities)  {
        this.collections = entities;
      }
      this.$emit('entitiesFromUrisFetched', this.collections);
    },

    mounted() {
      this.draw();
    },

    updated() {
      this.draw();
    },

    methods: {
      draw() {
        this.$nextTick(() => {
          this.$redrawVueMasonry && this.$redrawVueMasonry();
        });
      },

      imageSrcSet(collection) {
        if (collection.contentfulImage && this.$contentful.assets.isValidUrl(collection.contentfulImage.url)) {
          const smallImage = this.$contentful.assets.optimisedSrc(collection.contentfulImage, { w: 28, h: 28, fit: 'thumb' });
          const wqhdImage = this.$contentful.assets.optimisedSrc(collection.contentfulImage, { w: 45, h: 45, fit: 'thumb' });
          const fourKImage = this.$contentful.assets.optimisedSrc(collection.contentfulImage, { w: 67, h: 67, fit: 'thumb' });
          return `${smallImage} 28w, ${wqhdImage} 45w, ${fourKImage} 67w`;
        }
        return null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .related-collections ::v-deep .badge-pill {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .related-collections-card .related-collections ::v-deep .badge-pill {
    margin-bottom: 0.75rem;
    margin-right: 0.75rem;
  }

  .related-heading {
    margin-bottom: 0.75rem;
  }
</style>
