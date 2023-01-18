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
      v-if="cardVariant"
    >
      <b-card-group
        class="card-deck-4-cols"
        deck
      >
        <ContentCard
          v-for="relatedCollection in collections"
          :id="relatedCollection.id"
          :key="relatedCollection.id"
          :title="collectionTitle(relatedCollection)"
          :url="entityRouterLink(relatedCollection.id)"
          :image-url="imageUrl(relatedCollection)"
          :variant="cardVariant"
        />
      </b-card-group>
    </div>
    <div
      v-else
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
        :img="imageUrl(relatedCollection)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
        :image-src-set="imageSrcSet(relatedCollection)"
      />
    </div>
  </div>
</template>

<script>
  import pick from 'lodash/pick';
  import { withEditorialContent } from '@/plugins/europeana/themes';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';

  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'EntityBadges',

    components: {
      ContentCard: () => import('@/components/generic/ContentCard'),
      LinkBadge
    },

    mixins: [
      collectionLinkGenMixin,
      europeanaEntitiesOrganizationsMixin
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
      },
      cardVariant: {
        type: String,
        default: null
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

      let entities = await this.$apis.entity.find(this.entityUris);
      entities = entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo', 'type']));
      this.collections = await withEditorialContent(this, entities);
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

      collectionTitle(collection) {
        let title;

        const organizationNativePrefLabel = this.organizationEntityNativeName(collection);
        if (organizationNativePrefLabel) {
          title = organizationNativePrefLabel;
        } else if (collection.prefLabel) {
          title = collection.prefLabel;
        } else {
          title = collection.name;
        }

        return title;
      },

      imageUrl(collection) {
        if (collection.contentfulImage && this.$contentful.assets.isValidUrl(collection.contentfulImage.url)) {
          return this.$contentful.assets.optimisedSrc(
            collection.contentfulImage,
            { w: 28, h: 28, fit: 'thumb' }
          );
        }
        return this.$apis.entity.imageUrl(collection);
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