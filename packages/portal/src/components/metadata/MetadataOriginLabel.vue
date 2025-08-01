<template>
  <b-button
    v-if="translationSource"
    v-b-tooltip.bottomright
    :title="$t(`multilingual.${translationSource}`)"
    class="p-0 tooltip-button"
    :class="translationSource"
    variant="light-flat"
    data-qa="translation tooltip"
  />
</template>

<script>
  export default {
    name: 'MetadataOriginLabel',

    props: {
      translationSource: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .automated,
  .enrichment,
  .original {
    &::after {
      @extend %icon-font;

      font-weight: $font-size-medium;
      opacity: 0.2;
      font-size: 1.125rem;
    }
  }

  .automated::after {
    content: '\e941';
  }

  .enrichment::after {
    content: '\e940';
  }

  .original::after {
    content: '\e93f';
  }
</style>
