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
    <slot name="header" />
    <component
      :is="useDraggable ? 'draggable' : 'div'"
      v-model="cards"
      :draggable="useDraggable && '.item'"
      handle=".move-button"
      @end="endItemDrag"
    >
      <TransitionGroup name="fade">
        <template
          v-for="card in cards"
        >
          <div
            v-if="card === relatedGalleries"
            :key="card"
            v-masonry-tile
            class="masonry-tile related-results"
          >
            <slot
              :name="relatedGalleries"
            />
          </div>
          <div
            v-else-if="card === relatedCollections"
            :key="card"
            v-masonry-tile
            class="masonry-tile related-results"
          >
            <slot
              :name="relatedCollections"
            />
          </div>
          <ItemPreviewCard
            v-else
            :key="card.id"
            ref="cards"
            v-masonry-tile
            data-qa="item preview"
            class="masonry-tile item"
            :item="card"
            :hit-selector="itemHitSelector(card)"
            :variant="cardVariant"
            :lazy="true"
            :enable-accept-recommendation="enableAcceptRecommendations"
            :enable-reject-recommendation="enableRejectRecommendations"
            :route-hash="routeHash"
            :route-query="routeQuery"
            :show-pins="showPins"
            :show-move="useDraggable"
            :show-remove="userEditableItems"
            :offset="items.findIndex(item => item.id === card.id)"
            :on-aux-click-card="onAuxClickCard"
            :on-click-card="onClickCard"
          />
        </template>
      </TransitionGroup>
    </component>
  </div>
  <b-card-group
    v-else
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    :columns="view === 'list'"
    :deck="view !== 'list'"
  >
    <slot name="header" />
    <component
      :is="useDraggable ? 'draggable' : 'div'"
      v-model="cards"
      :draggable="useDraggable && '.item'"
      handle=".move-button"
      @end="endItemDrag"
    >
      <TransitionGroup name="fade">
        <template
          v-for="card in cards"
        >
          <div
            v-if="card === relatedGalleries"
            :key="card"
            class="related-results"
          >
            <slot
              :name="relatedGalleries"
            />
          </div>
          <div
            v-else-if="card === relatedCollections"
            :key="card"
            class="related-results"
          >
            <slot
              :name="relatedCollections"
            />
          </div>
          <ItemPreviewCard
            v-else
            :key="card.id"
            ref="cards"
            class="item"
            data-qa="item preview"
            :item="card"
            :hit-selector="itemHitSelector(card)"
            :variant="cardVariant"
            :route-hash="routeHash"
            :route-query="routeQuery"
            :show-pins="showPins"
            :show-move="useDraggable"
            :show-remove="userEditableItems"
            :offset="items.findIndex(item => item.id === card.id)"
            :on-aux-click-card="onAuxClickCard"
            :on-click-card="onClickCard"
          />
        </template>
      </TransitionGroup>
    </component>
  </b-card-group>
</template>

<script>
  import advancedSearchMixin from '@/mixins/advancedSearch';
  import ItemPreviewCard from './ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      draggable: () => import('vuedraggable'),
      ItemPreviewCard
    },

    mixins: [
      advancedSearchMixin
    ],

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
        relatedCollections: 'related-collections',
        showRelatedCollections: false,
        showRelatedGalleries: false
      };
    },

    computed: {
      cardGroupClass() {
        return this.view === 'list' ? 'card-group-list' : null;
      },

      cardVariant() {
        return this.view === 'grid' ? 'default' : this.view;
      },

      routeHash() {
        return this.routeQuery ? '#search' : undefined;
      },

      routeQuery() {
        if (this.$route.query?.qa) {
          const fulltext = this.advancedSearchRulesFromRouteQuery(this.$route.query.qa)
            .filter((rule) => (rule.field === 'fulltext') && (['contains', 'exact'].includes(rule.modifier)))
            .map((rule) => (rule.modifier === 'exact') ? `"${rule.term}"` : rule.term)
            .join(' ');
          return { fulltext };
        } else {
          return undefined;
        }
      },

      masonryActive() {
        return this.view === 'grid' || this.view === 'mosaic';
      },

      useDraggable() {
        return process.client && this.userEditableItems;
      }
    },

    watch: {
      'cards.length'() {
        this.redrawMasonry(400);
      },
      items() {
        this.initCards();
      },
      showRelatedCollections() {
        this.initCards();
      },
      showRelatedGalleries() {
        this.initCards();
      }
    },

    created() {
      this.showRelatedCollections = this.$slots[this.relatedCollections];
      this.showRelatedGalleries = this.$slots[this.relatedCollections];
      this.initCards();
    },

    mounted() {
      this.redrawMasonry();
      this.$emit('drawn', this.$refs.cards);
    },

    methods: {
      initCards() {
        const cards = [...this.items];

        if (this.showRelatedGalleries) {
          cards.splice(3, 0, this.relatedGalleries);
        }
        if (this.showRelatedCollections) {
          cards.splice(8, 0, this.relatedCollections);
        }

        this.cards = cards;
      },
      endItemDrag({ oldIndex, newIndex }) {
        // Read from items as cards contain related content irrelevent to drag
        if (this.items[oldIndex].id) {
          this.$emit('endItemDrag', { itemId: this.items[oldIndex].id, position: newIndex });
        }
        this.redrawMasonry();
      },
      itemHitSelector(item) {
        return this.hits?.find((hit) => item.id === hit.scope)?.selectors?.[0] || null;
      },
      redrawMasonry(timeout) {
        this.$nextTick(() => {
          // Timeout is needed to ensure that the masonry is redrawn after TransitionGroup has finished
          setTimeout(() => {
            this.$redrawVueMasonry?.();
          }, timeout || 0);
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/masonry';
  @import '@europeana/style/scss/transitions';
</style>
