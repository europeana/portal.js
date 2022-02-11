<template>
  <div
    v-if="view === 'grid' || view === 'mosaic'"
  >
    <div
      id="searchResultsGrid"
      :key="`searchResultsGrid${view}`"
      v-masonry
      transition-duration="0.1"
      item-selector=".card"
      horizontal-order="true"
      column-width=".masonry-container .card"
      class="masonry-container"
      :data-qa="`item previews ${view}`"
    >
      <template
        v-for="(item, index) in items"
      >
        <ItemPreviewCard
          :key="item.id"
          v-masonry-tile
          :item="item"
          :hit-selector="itemHitSelector(item)"
          :variant="cardVariant"
          class="item"
          :lazy="false"
          :enable-accept-recommendation="enableAcceptRecommendations"
          :enable-reject-recommendation="enableRejectRecommendations"
          :show-pins="showPins"
          data-qa="item preview"
          @like="$emit('like', item.id)"
          @unlike="$emit('unlike', item.id)"
        />
        <slot
          v-if="index === indexForRelatedCollections"
          v-masonry-tile
          name="related"
        />
      </template>
    </div>
  </div>
  <b-card-group
    v-else
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    deck
  >
    <template
      v-for="(item, index) in items"
    >
      <ItemPreviewCard
        :key="item.id"
        :item="item"
        :hit-selector="itemHitSelector(item)"
        :variant="cardVariant"
        :show-pins="showPins"
        data-qa="item preview"
        @like="$emit('like', item.id)"
        @unlike="$emit('unlike', item.id)"
      />
      <slot
        v-if="index === indexForRelatedCollections"
        name="related"
      />
    </template>
  </b-card-group>
</template>

<script>
  import ItemPreviewCard from './ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      ItemPreviewCard
    },

    props: {
      items: {
        type: Array,
        default: () => []
      },
      hits: {
        type: Array,
        default: null
      },
      perRow: {
        type: Number,
        default: 4
      },
      // grid/list/similar
      view: {
        type: String,
        default: 'grid'
      },
      showPins: {
        type: Boolean,
        default: false
      },
      enableAcceptRecommendations: {
        type: Boolean,
        default: false
      },
      enableRejectRecommendations: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      cardGroupClass() {
        let cardGroupClass;

        switch (this.view) {
        case 'list':
          cardGroupClass = 'card-group-list mx-0';
          break;
        case 'plain':
          cardGroupClass = `card-deck-search card-deck-${this.perRow}-cols`;
          break;
        case 'explore':
          cardGroupClass = 'card-deck-4-cols narrow-gutter explore-more';
          break;
        case 'similar':
          cardGroupClass = 'py-3 mx-0 card card-deck-4-cols similar-items';
          break;
        }

        return cardGroupClass;
      },

      cardVariant() {
        return this.view === 'grid' ? 'default' : this.view;
      },
      indexForRelatedCollections() {
        if (this.items.length) {
          return this.items.length > 4 ? 4 : this.items.length - 1;
        } else {
          return 0;
        }
      }
    },

    mounted() {
      const masonaryViews = ['grid', 'mosaic'];
      if (typeof this.$redrawVueMasonry === 'function' && masonaryViews.includes(this.view)) {
        this.$redrawVueMasonry('searchResultsGrid');
      }
    },

    methods: {
      itemHitSelector(item) {
        if (!this.hits) {
          return null;
        }

        const hit = this.hits.find(hit => item.id === hit.scope);
        return hit ? hit.selectors[0] : null;
      }
    }
  };
</script>
