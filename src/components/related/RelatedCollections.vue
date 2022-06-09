<template>
  <b-container
    v-show="collections.length > 0"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase mb-2">
      {{ title }}
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
        :title="relatedCollection.prefLabel ? relatedCollection.prefLabel : relatedCollection.name"
        :img="imageUrl(relatedCollection)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
      />
    </div>
  </b-container>
</template>

<script>
  import pick from 'lodash/pick';
  import { urlIsContentfulAsset, optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';
  import { withEditorialContent } from '@/plugins/europeana/themes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';

  import LinkBadge from '../generic/LinkBadge';

  export default {
    name: 'RelatedCollections',

    components: {
      LinkBadge
    },

    mixins: [collectionLinkGen],

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
      if (this.entityUris.length === 0 || this.relatedCollections.length > 0) {
        return;
      }

      const entities = await this.$apis.entity.find(this.entityUris);
      this.collections = await withEditorialContent(this, entities.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])));
    },

    mounted() {
      this.draw();
    },

    updated() {
      this.draw();
    },

    beforeDestroy() {
      this.draw('hide');
    },

    methods: {
      draw(showOrHide) {
        this.$emit(showOrHide || (this.collections.length > 0 ? 'show' : 'hide'));
        this.$nextTick(() => {
          this.$redrawVueMasonry && this.$redrawVueMasonry();
        });
      },

      imageUrl(collection) {
        if (collection.contentfulImage && urlIsContentfulAsset(collection.contentfulImage.url)) {
          return optimisedSrcForContentfulAsset(collection.contentfulImage, { w: 28, h: 28, fit: 'thumb' });
        }
        return this.$apis.entity.imageUrl(collection);
      }
    }
  };
</script>
