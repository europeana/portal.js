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
        default: null
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
      getSearchSuggestions(query) {
        if (!query) {
          return;
        }
        this.$apis.entity.suggest(query, {
          language: this.$i18n.locale,
          rows: 4
        })
          .then(response => (this.relatedCollections = response));
      }
    }
  };
</script>
