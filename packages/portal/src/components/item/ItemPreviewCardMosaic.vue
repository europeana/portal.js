<template>
  <div
    v-if="items.length"
    class="mosaic-container d-flex justify-content-between"
  >
    <div class="mosaic-column-1 d-flex flex-column">
      <ItemPreviewCard
        v-for="(card, index) in items.slice(0,2)"
        :key="index"
        ref="cards"
        :item="card"
        variant="mosaic"
        :class="`item mosaic-item mosaic-item-${index}`"
        :lazy="true"
        data-qa="item preview"
      />
    </div>
    <div class="mosaic-column-2 d-flex flex-column">
      <ItemPreviewCard
        v-for="(card, index) in items.slice(2,4)"
        :key="index + 2"
        ref="cards"
        :item="card"
        variant="mosaic"
        :class="`item mosaic-item mosaic-item-${index}`"
        :lazy="true"
        data-qa="item preview"
      />
    </div>
    <div
      class="mosaic-column-3 d-none d-md-flex flex-column flex-wrap align-content-start overflow-hidden "
    >
      <ItemPreviewCard
        v-for="(card, index) in items.slice(4)"
        :key="index"
        ref="cards"
        :item="card"
        variant="mosaic"
        class="item mosaic-item mosaic-item-x grid-item--width"
        :lazy="true"
        :offset="items.findIndex(item => item.id === card.id)"
        data-qa="item preview"
      />
    </div>
  </div>
</template>

<script>
  import ItemPreviewCard from '@/components/item/ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardMosaic',

    components: {
      ItemPreviewCard
    },

    props: {
      items: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .mosaic-container {
    height: 60vh;
    min-height: 500px;
    max-height: 700px;
    margin-left: -$grid-gutter;
    margin-right: -$grid-gutter;

    @media (min-width: $bp-large) {
      height: 70vh;
      min-height: 600px;
    }

    @media (min-width: $bp-xxxl) {
      max-height: 900px;
    }
  }

  .mosaic-column-1,
  .mosaic-column-2 {
    flex: 0 0 calc(50%);

    @media (min-width: $bp-large) {
      flex: 0 0 calc(25%);
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(25%);
    }
  }

  .mosaic-column-3 {
    @media (min-width: $bp-large) {
      flex: 0 0 calc(50%);
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(50%);
    }
  }

  ::v-deep {
    .card-wrapper {
      height: 100%;
    }
  }

  ::v-deep .card-img {
    min-height: 0;
    max-height: 100% !important;
  }

  .card.mosaic-item {
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
    min-width: 0;
    min-height: 0;
    flex: 1 1 auto;
    overflow: hidden;

    @media (min-width: $bp-4k) {
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
    }
  }

  .card.mosaic-item-x {
    max-height: calc(33.333% - 1.5rem);
    min-height: calc(16.667% - 1.5rem);

    @media (min-width: $bp-medium) {
      width: calc(100% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-large) {
      max-height: calc(50% - 1.5rem);
      width: calc(50% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-extralarge) {
      width: calc(33.333% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-xxxl) {
      min-height: calc(20% - 1.5rem);
      width: calc(25% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-4k) {
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
      width: calc(25% - #{$grid-gutter-4k * 2});
    }
  }
</style>
