<template>
  <b-card
    v-if="relatedCollections.length > 0 || entityUris.length > 0"
    class="text-left related-collections-card mb-4"
  >
    <RelatedCollections
      :title="$t('youMightAlsoLike')"
      :related-collections="relatedCollections"
      :entity-uris="entityUris"
      data-qa="related collections"
      @fetched="handleRelatedCollectionsFetched"
    />
  </b-card>
</template>

<script>
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { getEntityUri, getEntityQuery, getEntityTypeApi, normalizeEntityId } from '@/plugins/europeana/entity';

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
        .filter(uri => {
          if (!uri.startsWith(EUROPEANA_DATA_URL)) {
            return false;
          }
          return uri !== this.entityUri;
        })
        .slice(0, 4);
    },

    computed: {
      normalizedIdentifier() {
        return normalizeEntityId(this.identifier);
      },

      entityTypeApi() {
        return getEntityTypeApi(this.type);
      },

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
    },

    methods: {
      handleRelatedCollectionsFetched(relatedCollections) {
        this.relatedCollections = relatedCollections;
        this.$emit('fetched', relatedCollections);
      }
    }
  };
</script>
