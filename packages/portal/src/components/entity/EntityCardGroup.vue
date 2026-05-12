<template>
  <div
    v-if="collections.length"
    data-qa="related collections"
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
        v-for="collection in collections"
        :id="collection.id"
        :key="collection.id"
        :title="collectionTitle(collection)"
        :url="collectionLinkGen(collection)"
        :image-url="$apis.entity.imageUrl(collection)"
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
      entities: {
        type: Array,
        default: () => []
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
      if (this.entities?.length) {
        this.setCollectionsFromEntities(this.entities);
      } else if (this.entityUris?.length) {
        const entities = await this.$apis.entity.find(this.entityUris);
        this.setCollectionsFromEntities(entities);
        this.$emit('fetched');
      }
    },

    watch: {
      entities: {
        deep: true,
        handler() {
          this.setCollectionsFromEntities(this.entities);
        }
      }
    },

    methods: {
      collectionTitle,

      setCollectionsFromEntities(entities) {
        this.collections = entities?.map((entity) => this.pickEntity(entity)) || [];
      },

      pickEntity(entity) {
        return pick(entity, ['id', 'prefLabel', 'isShownBy', 'logo']);
      }
    }
  };
</script>
