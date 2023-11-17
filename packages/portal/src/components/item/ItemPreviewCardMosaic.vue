<template>
  <div
    v-if="items.length"
    class="mosaic-container d-flex justify-content-between"
  >
    <div class="mosaic-left-column">
      <ItemPreviewCard
        v-for="(card, index) in items.slice(0,3)"
        :key="index"
        ref="cards"
        :item="card"
        variant="mosaic"
        :class="`item mosaic-item mosaic-item-${index}`"
        :lazy="true"
        data-qa="item preview"
      />
    </div>
    <div
      class="mosaic-right-column"
    >
      <div
        class="mosaic-right-column-inner-wrapper"
      >
        <ItemPreviewCard
          v-for="(card, index) in items.slice(3)"
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

  .mosaic-left-column,
  .mosaic-right-column {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-left: -$grid-gutter;
    margin-right: -$grid-gutter;
    max-height: 100%;
  }

  .mosaic-left-column {
    flex: 0 0 calc(100% + $grid-gutter);

    @media (min-width: $bp-medium) {
      flex: 0 0 calc(75% + $grid-gutter);
    }

    @media (min-width: $bp-large) {
      flex: 0 0 calc(50% + $grid-gutter);
    }

    @media (min-width: $bp-extralarge) {
      flex: 0 0 calc(33% + $grid-gutter);
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(33% + $grid-gutter-4k);
    }
  }

  .mosaic-right-column {
    position: relative;
    display: none;

    @media (min-width: $bp-medium) {
      display: flex;
      flex: 0 0 calc(25% + $grid-gutter);
    }

    @media (min-width: $bp-large) {
      flex: 0 0 calc(50% + $grid-gutter);
    }

    @media (min-width: $bp-extralarge) {
      flex: 0 0 calc(67% + $grid-gutter);
    }

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(67% + $grid-gutter-4k);
    }
  }

  .mosaic-right-column-inner-wrapper {
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  ::v-deep {
    .card-wrapper {
      height: 100%;
      min-height: 0;
    }
  }

  ::v-deep .card-img {
    min-height: 0;
    max-height: 100% !important;

    img {
      min-height: 100%;
      min-width: 100%;
    }
  }

  .card.mosaic-item-0 {
    flex: 0 0 calc(100% - #{$grid-gutter * 2});
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
    max-width: none;

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(100% - #{$grid-gutter-4k * 2});
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
    }

    ::v-deep .card-img {
      position: relative;
      padding-top: 100%;

      img,
      span {
        height: 100%;
        position: absolute;
        top: 0;
      }

      span {
        display: flex;
        align-items: center;
      }
    }
  }

  .card.mosaic-item-1,
  .card.mosaic-item-2 {
    flex: 0 0 calc(50% - #{$grid-gutter * 2});
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
    min-width: 0;

    @media (min-width: $bp-4k) {
      flex: 0 0 calc(50% - #{$grid-gutter-4k * 2});
      margin-left: $grid-gutter-4k;
      margin-right: $grid-gutter-4k;
    }

    ::v-deep .card-img {
      position: relative;
      padding-top: 100%;

      img,
      span {
        height: 100%;
        position: absolute;
        top: 0;
      }

      span {
        display: flex;
        align-items: center;
      }
    }
  }

  .card.mosaic-item-x {
    width: 0;
    margin-left: $grid-gutter;
    margin-right: $grid-gutter;
    flex: 1 1 auto;
    max-height: calc(33.333% - 1.5rem);
    min-height: calc(16.667% - 1.5rem);
    min-width: 0;

    @media (min-width: $bp-medium) {
      width: calc(100% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-large) {
      max-height: calc(50% - 1.5rem);
      width: calc(33.333% - #{$grid-gutter * 2});
    }

    @media (min-width: $bp-extralarge) {
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
