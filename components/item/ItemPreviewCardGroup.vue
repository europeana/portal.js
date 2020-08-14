<template>
  <b-card-group
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    deck
  >
    <ItemPreviewCard
      v-for="item in value"
      :key="item.europeanaId"
      :variant="cardVariant"
      :dc-creator="item.dcCreator"
      :dc-description="item.dcDescription"
      :dc-title="item.dcTitle"
      :edm-data-provider="item.edmDataProvider"
      :edm-preview="item.edmPreview"
      :europeana-id="item.europeanaId"
      :selector="item.selector"
      data-qa="item preview"
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
