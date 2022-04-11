<template>
  <RelatedCollections
    v-if="!$fetchState.pending && (relatedCollections.length > 0)"
    :title="$t('youMightAlsoLike')"
    :related-collections="relatedCollections"
    @show="$emit('show')"
    @hide="$emit('hide')"
  />
</template>

<script>
  import pick from 'lodash/pick';

  import RelatedCollections from '../generic/RelatedCollections';

  export default {
    name: 'EntityRelatedCollections',

    components: {
      RelatedCollections
    },

    props: {
      type: {
        type: String,
        required: true
      },
      identifier: {
        type: String,
        required: true
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

    fetch() {
      if (this.overrides) {
        this.relatedCollections = this.overrides;
      } else {
        this.$apis.record.relatedEntities(this.type, this.identifier)
          .then(facets => facets ? this.$apis.entity.facets(facets, this.identifier) : [])
          .then(related => this.relatedCollections = related.map(entity => {
            return pick(entity, ['id', 'prefLabel', 'isShownBy']);
          }));
      }
    },

    watch: {
      type: '$fetch',
      identifier: '$fetch'
    }
  };
</script>
