<template>
  <RelatedCollections
    v-if="!$fetchState.pending && (relatedCollections.length > 0)"
    :title="$t('collectionsYouMightLike')"
    :related-collections="relatedCollections"
    :badge-variant="badgeVariant"
    @show="$emit('show')"
    @hide="$emit('hide')"
  />
</template>

<script>
  import RelatedCollections from '../generic/RelatedCollections';
  import { themeOverrides } from '@/plugins/europeana/themes';

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
        default: 'secondary'
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

    methods: {
      getSearchSuggestions(query) {
        if (!query) {
          return Promise.resolve([]);
        }
        return this.$apis.entity.suggest(query, {
          language: this.$i18n.locale,
          rows: 4
        }).then((related) => {
          return themeOverrides(this, related);
        });
      }
    }
  };
</script>
