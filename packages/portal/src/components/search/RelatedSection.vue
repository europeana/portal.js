<template>
  <aside
    v-if="relatedCollections.length > 0"
    v-masonry-tile
    class="masonry-tile related-results"
    :aria-label="$t('related.collections.name')"
  >
    <b-card
      class="text-left related-collections-card"
    >
      <RelatedCollections
        :related-collections="relatedCollections"
        badge-variant="secondary"
      />
    </b-card>
  </aside>
</template>

<script>
  import RelatedCollections from '../related/RelatedCollections';
  import { withEditorialContent } from '@/plugins/europeana/themes';

  export default {
    name: 'RelatedSection',

    components: {
      RelatedCollections
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
