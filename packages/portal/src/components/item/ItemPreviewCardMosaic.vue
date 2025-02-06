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
      class="mosaic-column-3 d-none d-lg-flex flex-column flex-wrap align-content-start overflow-hidden"
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
    height: 100vw;
    min-height: 300px;
    margin-left: -$grid-gutter;
    margin-right: -$grid-gutter;

    @media (min-width: $bp-large) {
      height: 600px;
    }

    @media (min-width: $bp-extralarge) {
      min-height: 600px;
      height: 50vw;
    }

    @media (min-width: $bp-xxxl) {
      height: 40vw;
    }

    @media (min-width: $bp-wqhd) {
      height: 1100px;
    }
  }

  .mosaic-column-1,
  .mosaic-column-2 {
    flex: 0 0 calc(50%);
    width: 50%;

    @media (min-width: $bp-large) {
      flex: 0 0 calc(25%);
      width: auto;
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(25%);
    }
  }

  .mosaic-column-3 {
    @media (min-width: $bp-large) {
      width: 0;
      flex: 0 0 calc(50%);
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(50%);
    }
  }

  ::v-deep {
    .card-wrapper {
      height: 100%;
      flex: 1 1 auto;
    }
  }

  ::v-deep .card-img {
    min-height: 0 !important;
    max-height: none !important;

    &.default-thumbnail {
      align-items: center;
    }

    img {
      object-position: 50% 20%;
      max-width: none;
    }
  }

  .card.mosaic-item {
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
    min-width: 0;
    min-height: 0;
    flex: 1 1 auto;
    flex-direction: column;
    overflow: hidden;

    @media (min-width: $bp-4k) {
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
    }
  }

  .card.mosaic-item-x {
    max-height: calc(33.333% - 1.5rem);
    min-height: calc(16.667% - 1.5rem);

    @media (min-width: $bp-large) {
      width: calc(50% - #{$grid-gutter * 2});
      max-height: calc(50% - 1.5rem);
    }

    @media (min-width: $bp-extralarge) {
      width: calc(33.333% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-xxxl) {
      min-height: calc(20% - 1.5rem);
      width: calc(25% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-wqhd) {
      max-height: calc(33.333% - 1.5rem);
    }

    @media (min-width: $bp-4k) {
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
      width: calc(25% - #{$grid-gutter-4k * 2});
    }
  }
</style>
