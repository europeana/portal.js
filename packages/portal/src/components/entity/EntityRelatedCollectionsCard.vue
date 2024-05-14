<template>
  <RelatedCollectionsCard
    :overrides="relatedCollections"
    :entity-uris="entityUris"
    data-qa="related collections"
    @entitiesFromUrisFetched="handleRelatedCollectionsCardFetched"
  />
</template>

<script>
  import { getEntityUri, getEntityQuery, getEntityTypeApi, normalizeEntityId } from '@/utils/europeana/entity.js';
  import RelatedCollectionsCard from '@/components/related/RelatedCollectionsCard';

  export default {
    name: 'EntityRelatedCollectionsCard',

    components: {
      RelatedCollectionsCard
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
          if (!uri.startsWith(this.$apis.data.constructor.BASE_URL)) {
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
      handleRelatedCollectionsCardFetched(relatedCollections) {
        this.relatedCollections = relatedCollections;
        this.$emit('entitiesFromUrisFetched', relatedCollections);
      }
    }
  };
</script>
