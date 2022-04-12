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
  import { normalizeEntityId } from '@/plugins/europeana/entity';

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
          .then(facets => facets ? this.facets(facets) : [])
          // TODO: why are we doing this? (formerly in entity plugin's `getRelatedEntityData` fn)
          .then(related => related.filter(entity => !!entity.prefLabel.en))
          .then(related => this.relatedCollections = related.map(entity => {
            return pick(entity, ['id', 'prefLabel', 'isShownBy']);
          }));
      }
    },

    watch: {
      type: '$fetch',
      identifier: '$fetch'
    },

    methods: {
      /**
       * Return the facets that include data.europeana.eu
       * @param {Object} facets the facets retrieved from the search
       * @param {String} id id of the current entity
       * @return {Object} related entities
       * TODO: limit results
       */
      facets(facets) {
        const currentId = normalizeEntityId(this.identifier);
        let entities = [];
        for (const facet of facets) {
          const facetFilter = (value) => value['label'].includes(EUROPEANA_DATA_URL) && value['label'].split('/').pop() !== currentId;
          entities = entities.concat(facet['fields'].filter(facetFilter));
        }

        const entityUris = entities.slice(0, 4).map(entity => {
          return entity['label'];
        });

        return this.$apis.entity.find(entityUris);
      }
    }
  };
</script>
