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
      <TransitionGroup name="fade">
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
            :key="card.id"
            ref="cards"
            v-masonry-tile
            :item="card"
            :hit-selector="itemHitSelector(card)"
            :variant="cardVariant"
            class="masonry-tile item"
            :lazy="true"
            :enable-accept-recommendation="enableAcceptRecommendations"
            :enable-reject-recommendation="enableRejectRecommendations"
            :route-hash="routeHash"
            :route-query="routeQuery"
            :show-pins="showPins"
            :show-move="useDraggable"
            :show-remove="userEditableItems"
            :offset="items.findIndex(item => item.id === card.id)"
            data-qa="item preview"
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
    <slot />
    <component
      :is="useDraggable ? 'draggable' : 'div'"
      v-model="cards"
      :draggable="useDraggable && '.item'"
      handle=".move-button"
      @end="endItemDrag"
    >
      <TransitionGroup name="fade">
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
            :route-hash="routeHash"
            :route-query="routeQuery"
            :show-pins="showPins"
            :show-move="useDraggable"
            :show-remove="userEditableItems"
            :offset="items.findIndex(item => item.id === card.id)"
            data-qa="item preview"
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
        this.$fetch();
      }
    },

    mounted() {
      this.redrawMasonry();
      this.$emit('drawn', this.$refs.cards);
    },

    methods: {
      endItemDrag({ newIndex }) {
        if (this.cards[newIndex].id) {
          this.$emit('endItemDrag', { itemId: this.cards[newIndex].id, position: newIndex });
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
