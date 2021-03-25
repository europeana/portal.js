<template>
  <b-container
    v-if="relatedCollections.length > 0"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase mt-4 mb-2">
      {{ title }}
    </h2>
    <div class="d-flex flex-wrap">
      <RelatedChip
        v-for="relatedCollection in relatedCollections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        :link-to="linkGen(relatedCollection)"
        :title="relatedCollection.prefLabel ? relatedCollection.prefLabel : relatedCollection.name"
        :img="imageUrl(relatedCollection)"
      />
    </div>
  </b-container>
</template>

<script>
  import { BASE_URL as EUROPEANA_DATA_URL } from '../../plugins/europeana/data';
  import { getEntityTypeHumanReadable, getEntitySlug } from '../../plugins/europeana/entity';

  import RelatedChip from './RelatedChip';

  export default {
    name: 'RelatedCollections',

    components: {
      RelatedChip
    },

    props: {
      title: {
        type: String,
        default: ''
      },
      relatedCollections: {
        type: Array,
        default: () => []
      }
    },

    methods: {
      linkGen(item) {
        let id = '';
        let name = '';

        if (item.id) {
          id = item.id;
          name = item.prefLabel[this.$i18n.locale];
        } else {
          id = item.identifier;
          name = item.name;
        }

        const uriMatch = id.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);
        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(id, name)
          }
        });
      },
      imageUrl(item) {
        if (typeof item.image === 'undefined' && typeof item.isShownBy === 'undefined') {
          return '';
        }
        if (item.image) {
          return item.image + '&size=w200';
        } else if (item.isShownBy.thumbnail) {
          return item.isShownBy.thumbnail + '&size=w200';
        }
      }
    }
  };
</script>
