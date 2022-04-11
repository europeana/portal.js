<template>
  <div
    v-if="masonryActive"
  >
    <div
      id="searchResultsGrid"
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
          v-masonry-tile
          :item="card"
          :hit-selector="itemHitSelector(card)"
          :variant="cardVariant"
          class="item"
          :lazy="false"
          :enable-accept-recommendation="enableAcceptRecommendations"
          :enable-reject-recommendation="enableRejectRecommendations"
          :show-pins="showPins"
          data-qa="item preview"
          @like="$emit('like', card.id)"
          @unlike="$emit('unlike', card.id)"
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
        :hit-selector="itemHitSelector(card)"
        :variant="cardVariant"
        :show-pins="showPins"
        data-qa="item preview"
        @like="$emit('like', card.id)"
        @unlike="$emit('unlike', card.id)"
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
      showRelated: {
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
      cards() {
        return this.items.slice(0, 4).concat('related').concat(this.items.slice(4));
      },

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

      masonryActive() {
        return this.view === 'grid' || this.view === 'mosaic';
      }
    },

    watch: {
      'cards.length'() {
        this.redrawMasonry();
      }
    },

    mounted() {
      this.redrawMasonry();
    },

    methods: {
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
