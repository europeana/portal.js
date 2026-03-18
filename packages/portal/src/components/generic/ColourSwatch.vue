<template>
  <span
    class="colour-palette"
    :style="`backgroundColor: ${hexCode}`"
    :data-qa="`colour swatch ${hexCode}`"
  />
</template>

<script>
  export default {
    name: 'ColourSwatch',

    props: {
      hexCode: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .colour-palette {
    border: 1px solid $whitegrey;
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    vertical-align: top;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
  }
</style>
