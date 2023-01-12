<template>
  <b-card
    v-show="relatedCollections.length > 0"
    class="text-left related-collections-card"
  >
    <EntityGroup
      v-if="relatedCollections.length > 0"
      :related-collections="relatedCollections"
      badge-variant="secondary"
    />
  </b-card>
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
      } else if (this.query && this.query !== '') {
        this.relatedCollections = await this.getSearchSuggestions(this.query);
        this.$emit('fetched', this.relatedCollections);
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
