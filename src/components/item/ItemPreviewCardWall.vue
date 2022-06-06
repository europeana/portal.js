<template>
  <div
    v-masonry
    transition-duration="0.1"
    item-selector=".card"
    horizontal-order="true"
    column-width=".masonry-container .card:not(.header-card)"
    class="masonry-container"
    data-qa="item preview card wall"
  >
    <ItemPreviewCardGroup
      :items="items"
      :hits="hits"
      :view="view"
      :show-pins="showPins"
      :show-related="showRelated"
      :draggable-items="draggableItems"
      :enable-accept-recommendations="enableAcceptRecommendations"
      :enable-reject-recommendations="enableRejectRecommendations"
      @endItemDrag="endItemDrag"
    >
      <slot />
      <template
        #related
      >
        <slot
          name="related"
        />
      </template>
    </ItemPreviewCardGroup>
  </div>
</template>

<script>
  import ItemPreviewCardGroup from './ItemPreviewCardGroup';

  export default {
    name: 'ItemPreviewCardWall',

    components: {
      ItemPreviewCardGroup
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
       * @values grid, mosaic
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

    watch: {
      'items.length': 'redrawMasonry',
      view: 'redrawMasonry'
    },

    mounted() {
      this.redrawMasonry();
    },

    methods: {
      redrawMasonry() {
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$nextTick(() => {
            this.$redrawVueMasonry();
          });
        }
      },

      endItemDrag(items) {
        this.$emit('endItemDrag', items);
      }
    }
  };
</script>
