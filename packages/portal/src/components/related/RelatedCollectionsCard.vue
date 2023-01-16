<template>
  <aside
    v-if="relatedCollections.length > 0 || entityUris.length > 0"
  >
    <b-card
      class="text-left related-collections-card"
    >
      <EntityGroup
        :related-collections="relatedCollections"
        :entity-uris="entityUris"
        badge-variant="secondary"
        @entitiesFromUrisFetched="(collections) => $emit('entitiesFromUrisFetched', collections)"
      />
    </b-card>
  </aside>
</template>

<script>
  import { withEditorialContent } from '@/plugins/europeana/themes';

  export default {
    name: 'RelatedCollectionsCard',

    components: {
      EntityGroup: () => import('@/components/entity/EntityGroup')
    },

    props: {
      query: {
        type: String,
        default: null
      },
      overrides: {
        type: Array,
        default: null
      },
      entityUris: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    async fetch() {
      if (this.overrides) {
        this.relatedCollections = this.overrides;
      } else if (this.entityUris.length) {
        return;
      } else if (this.query && this.query !== '') {
        this.relatedCollections = await this.getSearchSuggestions(this.query);
        this.$emit('relatedFetched', this.relatedCollections);
      }
    },

    watch: {
      query: '$fetch'
    },

    methods: {
      getSearchSuggestions(query) {
        return this.$apis.entity.suggest(query, {
          language: this.$i18n.locale,
          rows: 4
        }).then((related) => {
          return withEditorialContent(this, related);
        });
      }
    }
  };
</script>
