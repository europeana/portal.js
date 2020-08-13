<template>
  <b-card-group
    :data-qa="`search results ${view}`"
    :class="cardGroupClass"
    deck
  >
    <ItemPreviewCard
      v-for="result in value"
      :key="result.europeanaId"
      :variant="cardVariant"
      :dc-creator="result.dcCreator"
      :dc-description="result.dcDescription"
      :dc-title="result.dcTitle"
      :edm-data-provider="result.edmDataProvider"
      :edm-preview="result.edmPreview"
      :europeana-id="result.europeanaId"
      :selector="result.selector"
      data-qa="search result"
    />
  </b-card-group>
</template>

<script>
  import ItemPreviewCard from '../item/ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      ItemPreviewCard
    },

    props: {
      value: {
        type: Array,
        default: () => []
      },
      perRow: {
        type: Number,
        default: 4
      },
      view: {
        type: String,
        default: 'grid'
      }
    },

    computed: {
      cardGroupClass() {
        return this.view === 'list' ? 'card-group-list mx-0' : `card-deck-search masonry card-deck-${this.perRow}-cols`;
      },

      cardVariant() {
        return this.view === 'list' ? 'list' : 'default';
      }
    }
  };
</script>
