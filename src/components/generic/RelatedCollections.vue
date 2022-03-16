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
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
      />
    </div>
  </b-container>
</template>

<script>
  import { BASE_URL as EUROPEANA_DATA_URL } from '../../plugins/europeana/data';
  import { getEntityTypeHumanReadable, getEntitySlug, getWikimediaThumbnailUrl } from '../../plugins/europeana/entity';

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
      },
      badgeVariant: {
        type: String,
        default: 'primary'
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
        let url = null;

        if (item.image) {
          url = `${item.image}&size=w200`;
        } else if (item.isShownBy?.thumbnail) {
          url = `${item.isShownBy.thumbnail}&size=w200`;
        } else if (item.logo) {
          url = getWikimediaThumbnailUrl(item.logo.id, 28);
        }

        return url;
      }
    }
  };
</script>
