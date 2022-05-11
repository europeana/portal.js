<template>
  <RelatedCollections
    v-if="!$fetchState.pending"
    :title="$t('youMightAlsoLike')"
    :related-collections="relatedCollections"
    :entity-uris="entityUris"
    @show="$emit('show')"
    @hide="$emit('hide')"
  />
</template>

<script>
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { getEntityUri, getEntityQuery } from '@/plugins/europeana/entity';

  import RelatedCollections from '../related/RelatedCollections';

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
        entityUris: [],
        relatedCollections: []
      };
    },

    async fetch() {
      if (this.overrides) {
        this.relatedCollections = this.overrides;
        return;
      }
      const recordSearchParams = {
        profile: 'facets',
        facet: 'skos_concept',
        query: this.entityQuery,
        qf: ['contentTier:*'],
        rows: 0
      };

      const response = await this.$apis.record.search(recordSearchParams);
      const facets = response?.facets || [];
      this.entityUris = facets
        .reduce((memo, facet) => {
          memo = memo.concat(facet.fields.map(entity => entity.label));
          return memo;
        }, [])
        .filter(uri => uri.startsWith(EUROPEANA_DATA_URL) && (uri !== this.entityUri))
        .slice(0, 4);
    },

    computed: {
      entityUri() {
        return getEntityUri(this.type, this.identifier);
      },

      entityQuery() {
        return getEntityQuery(this.entityUri);
      }
    },

    watch: {
      type: '$fetch',
      identifier: '$fetch'
    }
  };
</script>
