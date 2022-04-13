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

  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import { normalizeEntityId, getEntityUri, getEntityQuery } from '@/plugins/europeana/entity';

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
        return Promise.resolve();
      } else {
        const recordSearchParams = {
          profile: 'facets',
          facet: 'skos_concept',
          query: this.entityQuery,
          qf: ['contentTier:*'],
          rows: 0
        };

        return this.$apis.record.search(recordSearchParams)
          .then(response => response?.facets ? this.fetchEntities(response.facets) : [])
          // TODO: why are we doing this? (formerly in entity plugin's `getRelatedEntityData` fn)
          .then(related => related.filter(entity => !!entity.prefLabel.en))
          .then(related => this.relatedCollections = related.map(entity => pick(entity, ['id', 'prefLabel', 'isShownBy'])));
      }
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
    },

    methods: {
      fetchEntities(facets) {
        const entityUris = facets.reduce((memo, facet) => {
          memo = memo.concat(facet.fields.map(entity => entity.label));
          return memo;
        }, [])
          .filter(uri => uri.startsWith(EUROPEANA_DATA_URL) && (uri !== this.entityUri))
          .slice(0, 4);

        return this.$apis.entity.find(entityUris);
      }
    }
  };
</script>
