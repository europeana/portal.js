<template>
  <RelatedCollections
    :title="$t('collectionsYouMightLike')"
    :related-collections="relatedCollections"
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
        default: ''
      }
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    fetch() {
      this.getSearchSuggestions(this.query);
    },

    watch: {
      query: '$fetch'
    },

    methods: {
      async getSearchSuggestions(query) {
        this.relatedCollections = query === '' ? [] : await this.$store.getters['apis/entity'].getEntitySuggestions(query, {
          language: this.$i18n.locale,
          rows: 4
        });
      }
    }
  };
</script>
