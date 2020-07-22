<template>
  <RelatedCollections
    :title="$t('collectionsYouMightLike')"
    :related-collections="relatedCollections"
  />
</template>

<script>
  import RelatedCollections from '../generic/RelatedCollections';
  import { getEntitySuggestions } from '../../plugins/europeana/entity';
  import { mapGetters } from 'vuex';

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

    fetch() {
      this.getSearchSuggestions(this.query);
    },

    data() {
      return {
        relatedCollections: []
      };
    },

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      })
    },

    watch: {
      query: '$fetch'
    },

    methods: {
      async getSearchSuggestions(query) {
        this.relatedCollections = query === '' ? [] : await getEntitySuggestions(query, {
          language: this.$i18n.locale,
          rows: 4
        });
      }
    }
  };
</script>
