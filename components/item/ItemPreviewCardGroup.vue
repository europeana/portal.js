<template>
  <!-- <b-card-group
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    deck
  >
    <ItemPreviewCard
      v-for="(item, index) in value"
      :key="item.id"
      v-model="value[index]"
      :hit-selector="itemHitSelector(item)"
      :variant="cardVariant"
      data-qa="item preview"
      @like="$emit('like', item.id)"
      @unlike="$emit('unlike', item.id)"
    />
  </b-card-group> -->
  <no-ssr>
    <div
      v-masonry
      transition-duration="0"
      item-selector=".item"
      horizontal-order="true"
      column-width=".masonry-container .card"
      gutter="15"
      class="masonry-container"
    >
      <ItemPreviewCard
        v-for="(item, index) in value"
        :key="item.id"
        v-model="value[index]"
        v-masonry-tile
        :hit-selector="itemHitSelector(item)"
        :variant="cardVariant"
        class="item"
        data-qa="item preview"
        @like="$emit('like', item.id)"
        @unlike="$emit('unlike', item.id)"
      />
    </div>
  </no-ssr>
</template>

<script>
  import ItemPreviewCard from './ItemPreviewCard';
  import NoSSR from 'vue-no-ssr';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      'no-ssr': NoSSR,
      ItemPreviewCard
    },

    props: {
      value: {
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
      }
    },

    computed: {
      cardGroupClass() {
        let cardGroupClass;

        switch (this.view) {
        case 'list':
          cardGroupClass = 'card-group-list mx-0';
          break;
        case 'grid':
          cardGroupClass = `card-deck-search masonry card-deck-${this.perRow}-cols`;
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
      }
    },

    mounted() {
      if (typeof this.$redrawVueMasonry === 'function') {
        this.$redrawVueMasonry();
      }
    },

    methods: {
      itemHitSelector(item) {
        if (!this.hits) return null;

        const hit = this.hits.find(hit => item.id === hit.scope);
        return hit ? hit.selectors[0] : null;
      }
    }
  };
</script>
