<template>
  <div
    v-if="relatedCollections.length > 0"
    data-qa="related collections"
    class="related-collections"
  >
    <h2 class="related-heading text-uppercase mb-2">
      {{ title }}
    </h2>
    <div
      class="d-flex"
      :class="chipsWrapperClass"
    >
      <RelatedChip
        v-for="relatedCollection in relatedCollections"
        :id="relatedCollection.id"
        :key="relatedCollection.id"
        :ref="chipsRef"
        :link-to="linkGen(relatedCollection)"
        :title="relatedCollection.prefLabel ? relatedCollection.prefLabel : relatedCollection.name"
        :img="imageUrl(relatedCollection)"
        :type="relatedCollection.type"
        :badge-variant="badgeVariant"
      />
    </div>
  </div>
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
      },
      badgeVariant: {
        type: String,
        default: 'secondary'
      },
      chipsWrapperClass: {
        type: String,
        default: 'flex-wrap'
      },
      chipsRef: {
        type: String,
        default: null
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
        let id = '';
        let name = '';
        console.log(collection);
        if (collection.id) {
          id = collection.id;
          name = collection.prefLabel[this.$i18n.locale];
        } else {
          id = collection.identifier;
          name = collection.name;
        }

        const uriMatch = id.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);

        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(id, name)
          }
        });
      },

      imageUrl(collection) {
        if (collection.contentfulImage) {
          // get contentful img url.
        }
        return this.$apis.entity.imageUrl(collection);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .quick-search-chips {
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    padding-top: 0.25rem;

    &::-webkit-scrollbar {
      display: none;
    }

    .badge {
      flex-shrink: 0;
      margin-right: 0.75rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
