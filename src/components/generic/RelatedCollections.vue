<template>
  <b-container
    v-if="relatedCollections.length > 0"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase mb-2">
      {{ title }}
    </h2>
    <div class="d-flex flex-wrap">
      <LinkBadge
        v-for="relatedCollection in relatedCollections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        :link-to="linkGen(relatedCollection)"
        :title="relatedCollection.prefLabel ? relatedCollection.prefLabel : relatedCollection.name"
        :img="imageUrl(relatedCollection)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
      />
    </div>
  </b-container>
</template>

<script>
  import { BASE_URL as EUROPEANA_DATA_URL } from '../../plugins/europeana/data';
  import { getEntityTypeHumanReadable, getEntitySlug } from '../../plugins/europeana/entity';

  import LinkBadge from './LinkBadge';

  export default {
    name: 'RelatedCollections',

    components: {
      LinkBadge
    },

    props: {
      title: {
        type: String,
        default: ''
      },
      relatedCollections: {
        type: Array,
        default: () => []
      },
      badgeVariant: {
        type: String,
        default: 'secondary'
      }
    },

    mounted() {
      this.draw();
    },

    updated() {
      this.draw();
    },

    beforeDestroy() {
      this.draw('hide');
    },

    methods: {
      draw(showOrHide) {
        this.$emit(showOrHide || (this.relatedCollections.length > 0 ? 'show' : 'hide'));
        this.$nextTick(() => {
          this.$redrawVueMasonry && this.$redrawVueMasonry();
        });
      },

      linkGen(collection) {
        const uriMatch = collection.id.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);

        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(collection.id, collection.prefLabel.en)
          }
        });
      },

      imageUrl(collection) {
        return this.$apis.entity.imageUrl(collection);
      }
    }
  };
</script>
