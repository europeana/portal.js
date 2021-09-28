<template>
  <button
    v-if="translatedItemsEnabled && translationSource"
    v-b-tooltip.bottomright="{ customClass: 'tooltip' }"
    :title="$t(`multilingual.${translationSource}`)"
    class="translation-source"
    :class="translationSource"
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
    },

    computed: {
      translatedItemsEnabled() {
        return this.$config.app.features.translatedItems;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import '@/assets/scss/icons.scss';
  .automated, .enrichment, .original {
    &:after {
      @extend .icon-font;
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
  .translation-source {
    border: none;
    background-color: transparent;
    cursor: default;
    display: inline;
  }
</style>
