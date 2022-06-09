<template>
  <div
    v-if="masonryActive"
    :key="`searchResultsGrid${view}`"
    v-masonry
    transition-duration="0.1"
    item-selector=".card"
    horizontal-order="true"
    column-width=".masonry-container .card:not(.header-card)"
    class="masonry-container"
    :data-qa="`item previews ${view}`"
  >
    <slot />
    <component
      :is="draggableItems ? 'draggable' : 'div'"
      v-model="orderedItems"
      handle=".move-button"
      @end="endItemDrag"
    >
      <template
        v-for="(card, index) in cards"
      >
        <template
          v-if="card === 'related'"
        >
          <b-card
            v-show="showRelated"
            :key="index"
            class="text-left related-collections-card mb-4"
          >
            <slot
              v-masonry-tile
              name="related"
            />
          </b-card>
        </template>
        <ItemPreviewCard
          v-else
          :key="index"
          :item="card"
          :hit-selector="itemHitSelector(card)"
          :variant="cardVariant"
          class="item"
          :lazy="true"
          :enable-accept-recommendation="enableAcceptRecommendations"
          :enable-reject-recommendation="enableRejectRecommendations"
          :show-pins="showPins"
          :show-move="draggableItems"
          :offset="orderedItems.findIndex(item => item.id === card.id)"
          data-qa="item preview"
          @like="$emit('like', card.id)"
          @unlike="$emit('unlike', card.id)"
        />
      </template>
    </component>
  </div>
  <component
    :is="draggableItems ? 'draggable' : 'b-card-group'"
    v-else
    v-model="orderedItems"
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    deck
    @end="endItemDrag"
  >
    <slot />
    <template
      v-for="(card, index) in cards"
    >
      <template
        v-if="card === 'related'"
      >
        <b-card
          v-show="showRelated"
          :key="index"
          class="text-left related-collections-card mb-4"
        >
          <slot
            name="related"
          />
        </b-card>
      </template>
      <ItemPreviewCard
        v-else
        :key="card.id"
        :item="card"
        class="item"
        :hit-selector="itemHitSelector(card)"
        :variant="cardVariant"
        :show-pins="showPins"
        :show-move="draggableItems"
        :offset="orderedItems.findIndex(item => item.id === card.id)"
        data-qa="item preview"
        @like="$emit('like', card.id)"
        @unlike="$emit('unlike', card.id)"
      />
    </template>
  </component>
</template>

<script>
  import draggable from 'vuedraggable';
  import ItemPreviewCard from './ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      draggable,
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
      /**
       * Layout view to use
       * @values grid, mosaic, list, explore
       */
      view: {
        type: String,
        default: 'grid'
      },
      showPins: {
        type: Boolean,
        default: false
      },
      showRelated: {
        type: Boolean,
        default: false
      },
      draggableItems: {
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

    data() {
      return {
        orderedItems: this.items
      };
    },

    computed: {
      cards() {
        return this.orderedItems.slice(0, 4).concat('related').concat(this.orderedItems.slice(4));
      },

      cardGroupClass() {
        let cardGroupClass;

        switch (this.view) {
        case 'list':
          cardGroupClass = 'card-group-list mx-0';
          break;
        case 'explore':
          cardGroupClass = 'card-deck-4-cols narrow-gutter explore-more';
          break;
        }

        return cardGroupClass;
      },

      cardVariant() {
        return this.view === 'grid' ? 'default' : this.view;
      },

      masonryActive() {
        return this.view === 'grid' || this.view === 'mosaic';
      }
    },

    watch: {
      'cards.length': 'redrawMasonry',
      items() {
        this.orderedItems = this.items;
      }
    },

    mounted() {
      this.redrawMasonry();
    },

    methods: {
      endItemDrag() {
        this.$emit('endItemDrag', this.cards.filter(card => card !== 'related'));
      },
      itemHitSelector(item) {
        if (!this.hits) {
          return null;
        }

        const hit = this.hits.find(hit => item.id === hit.scope);
        return hit ? hit.selectors[0] : null;
      },
      redrawMasonry() {
        if (typeof this.$redrawVueMasonry === 'function' && this.masonryActive) {
          this.$nextTick(() => {
            this.$redrawVueMasonry();
          });
        }
      }
    }
  };
</script>
