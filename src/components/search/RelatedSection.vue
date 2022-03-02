<template>
  <RelatedCollections
    v-if="!$fetchState.pending && (relatedCollections.length > 0)"
    :title="$t('collectionsYouMightLike')"
    :related-collections="relatedCollections"
    :badge-variant="badgeVariant"
  />
</template>

<script>
  import RelatedCollections from '../generic/RelatedCollections';

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
      badgeVariant: {
        type: String,
        default: 'primary'
      }
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    fetch() {
      return this.getSearchSuggestions(this.query)
        .then(response => {
          this.relatedCollections = response;
        });
    },

    watch: {
      query: '$fetch'
    },

    updated() {
      this.draw();
    },

    methods: {
      draw() {
        this.$emit(this.relatedCollections.length > 0 ? 'show' : 'hide');
        this.$nextTick(() => {
          this.$redrawVueMasonry && this.$redrawVueMasonry();
        });
      },

      getSearchSuggestions(query) {
        if (!query) {
          return Promise.resolve();
        }
        return this.$apis.entity.suggest(query, {
          language: this.$i18n.locale,
          rows: 4
        });
      }
    }
  };
</script>
