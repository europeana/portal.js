<template>
  <div
    v-if="collections.length"
    data-qa="related collections"
    class="related-collections"
  >
    <h2
      v-if="title"
      class="card-group-title"
    >
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
        :image-url="$apis.entity.imageUrl(relatedCollection)"
        :variant="cardVariant"
      />
    </b-card-group>
  </div>
</template>

<script>
  import pick from 'lodash/pick.js';

  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import { collectionTitle } from '@/utils/europeana/entities/entityLinks';

  export default {
    name: 'EntityCardGroup',

    components: {
      ContentCard: () => import('@/components/content/ContentCard')
    },

    mixins: [
      collectionLinkGenMixin
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
      if (this.entityUris?.length) {
        const entities = await this.$apis.entity.find(this.entityUris);
        this.collections = entities?.map((entity) => pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo'])) || [];
      }
      this.$emit('fetched');
    },

    methods: {
      collectionTitle
    }
  };
</script>
