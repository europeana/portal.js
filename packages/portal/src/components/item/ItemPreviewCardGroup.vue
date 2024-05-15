<template>
  <div
    v-if="masonryActive"
    :key="`searchResultsGrid${view}`"
    v-masonry
    transition-duration="0.1"
    item-selector=".masonry-tile"
    horizontal-order="true"
    column-width=".masonry-container .card:not(.header-card)"
    class="masonry-container"
    :data-qa="`item previews ${view}`"
  >
    <slot />
    <component
      :is="useDraggable ? 'draggable' : 'div'"
      v-model="cards"
      :draggable="useDraggable && '.item'"
      handle=".move-button"
      @end="endItemDrag"
    >
      <template
        v-for="(card, index) in cards"
      >
        <template v-if="card === relatedGalleries">
          <div
            v-if="$slots[relatedGalleries]"
            :key="index"
            v-masonry-tile
            class="masonry-tile related-results"
          >
            <slot
              :name="relatedGalleries"
            />
          </div>
        </template>
        <template v-else-if="card === relatedCollections">
          <div
            v-if="$slots[relatedCollections]"
            :key="index"
            v-masonry-tile
            class="masonry-tile related-results"
          >
            <slot
              :name="relatedCollections"
            />
          </div>
        </template>
        <ItemPreviewCard
          v-else
          :key="index"
          ref="cards"
          v-masonry-tile
          :item="card"
          :hit-selector="itemHitSelector(card)"
          :variant="cardVariant"
          class="masonry-tile item"
          :lazy="true"
          :enable-accept-recommendation="enableAcceptRecommendations"
          :enable-reject-recommendation="enableRejectRecommendations"
          :show-pins="showPins"
          :show-move="useDraggable"
          :show-remove="userEditableItems"
          :offset="items.findIndex(item => item.id === card.id)"
          data-qa="item preview"
          :on-aux-click-card="onAuxClickCard"
          :on-click-card="onClickCard"
        />
      </template>
    </component>
  </div>
  <component
    :is="useDraggable ? 'draggable' : 'b-card-group'"
    v-else
    v-model="cards"
    :draggable="useDraggable && '.item'"
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    :columns="view === 'list'"
    :deck="view !== 'list'"
    @end="endItemDrag"
  >
    <slot />
    <template
      v-for="(card, index) in cards"
    >
      <template v-if="card === relatedGalleries">
        <div
          v-if="$slots[relatedGalleries]"
          :key="index"
          class="related-results"
        >
          <slot
            :name="relatedGalleries"
          />
        </div>
      </template>
      <template v-else-if="card === relatedCollections">
        <div
          v-if="$slots[relatedCollections]"
          :key="index"
          class="related-results"
        >
          <slot
            :name="relatedCollections"
          />
        </div>
      </template>
      <ItemPreviewCard
        v-else
        :key="card.id"
        ref="cards"
        :item="card"
        class="item"
        :hit-selector="itemHitSelector(card)"
        :variant="cardVariant"
        :show-pins="showPins"
        :show-move="useDraggable"
        :show-remove="userEditableItems"
        :offset="items.findIndex(item => item.id === card.id)"
        data-qa="item preview"
        :on-aux-click-card="onAuxClickCard"
        :on-click-card="onClickCard"
      />
    </template>
  </component>
</template>

<script>
  import ItemPreviewCard from './ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      draggable: () => import('vuedraggable'),
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
       * @values grid, mosaic, list
       */
      view: {
        type: String,
        default: 'grid'
      },
      showPins: {
        type: Boolean,
        default: false
      },
      userEditableItems: {
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
      },
      onClickCard: {
        type: Function,
        default: null
      },
      onAuxClickCard: {
        type: Function,
        default: null
      }
    },

    data() {
      return {
        cards: [],
        relatedGalleries: 'related-galleries',
        relatedCollections: 'related-collections'
      };
    },

    fetch() {
      const cards = [...this.items];
      cards.splice(3, 0, this.relatedGalleries);
      cards.splice(8, 0, this.relatedCollections);
      this.cards = cards;
    },

    computed: {
      cardGroupClass() {
        return this.view === 'list' ? 'card-group-list' : null;
      },

      cardVariant() {
        return this.view === 'grid' ? 'default' : this.view;
      },

      masonryActive() {
        return this.view === 'grid' || this.view === 'mosaic';
      },

      useDraggable() {
        return process.client && this.userEditableItems;
      }
    },

    watch: {
      'cards.length': 'redrawMasonry',
      items() {
        this.$fetch();
      }
    },

    async mounted() {
      await this.redrawMasonry();
      this.$emit('drawn', this.$refs.cards);
    },

    methods: {
      endItemDrag() {
        this.$emit('endItemDrag', this.cards.filter(card => ![this.relatedGalleries, this.relatedCollections].includes(card)));
      },
      itemHitSelector(item) {
        return this.hits?.find((hit) => item.id === hit.scope)?.selectors?.[0] || null;
      },
      redrawMasonry() {
        this.$nextTick(() => {
          this.$redrawVueMasonry?.();
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/masonry';
</style>
