<template>
  <b-container
    v-if="relatedCollections.length > 0"
    data-qa="related collections"
  >
    <h2 class="related-heading text-uppercase mt-4 mb-2">
      {{ title }}
    </h2>
    <RelatedChip
      v-for="relatedCollection in relatedCollections"
      :id="relatedCollection.id"
      :key="relatedCollection.id"
      :link-to="linkGen(relatedCollection)"
      :title="titleGen(relatedCollection)"
      :img="`${imageUrl(relatedCollection)}&size=w200`"
    />
  </b-container>
</template>

<script>
  import RelatedChip from './RelatedChip';
  import { getEntityTypeHumanReadable, getEntitySlug } from '../../plugins/europeana/entity';
  import { mapGetters } from 'vuex';

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

    computed: {
      ...mapGetters({
        apiConfig: 'apis/config'
      })
    },

    methods: {
      linkGen(item) {
        console.log(item);
        let id = item.id;
        let name = item.prefLabel[this.$i18n.locale];

        const uriMatch = id.match(`^${this.apiConfig.data.origin}/([^/]+)(/base)?/(.+)$`);
        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(id, name)
          }
        });
      },
      titleGen(item) {
        console.log(item);
        return;
        // if (item.prefLabel.length > 0) {
        //   return item.prefLabel[this.$i18n.locale];
        // } else {
        //   return item.name;
        // }
      },
      imageUrl(item) {
        if (typeof item.image !== 'undefined') {
          return item.image;
        } else if (typeof item.isShownBy.thumbnail !== 'undefined') {
          return item.isShownBy.thumbnail;
        }
        return;
      }
    }
  };
</script>
