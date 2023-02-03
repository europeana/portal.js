<template>
  <div
    v-if="collections.length"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 v-if="title">
      {{ title }}
    </h2>
    <b-card-group
      class="card-deck-4-cols"
      :class="cardGroupClass"
      deck
    >
      <ContentCard
        v-for="relatedCollection in collections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        :title="collectionTitle(relatedCollection)"
        :url="entityRouterLink(relatedCollection.id)"
        :image-url="imageUrl(relatedCollection, 80, 80)"
        :variant="cardVariant"
      />
    </b-card-group>
  </div>
</template>

<script>
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import europeanaEntityLinks from '@/mixins/europeana/entities/entityLinks';

  export default {
    name: 'EntityCardGroup',

    components: {
      ContentCard: () => import('@/components/generic/ContentCard')
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
      entityUris: {
        type: Array,
        default: () => []
      },
      cardVariant: {
        type: String,
        default: null
      },
      cardGroupClass: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        collections: []
      };
    },

    async fetch() {
      if (!this.entityUris?.length) {
        return;
      }

      const entities = await this.$apis.entity.find(this.entityUris, {
        fl: 'skos_prefLabel.*,isShownBy,isShownBy.thumbnail,logo'
      });

      if (entities)  {
        this.collections = entities;
      }
    }
  };
</script>
