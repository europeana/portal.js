<template>
  <span class="automated-translation-label d-inline-flex">
    <span
      class="icon-automated d-inline-flex align-items-center mr-2"
    />
    {{ $t('multilingual.automatedPageTranslations') }}
  </span>
</template>

<script>
  export default {
    name: 'StaticAutomatedTranslationLabel'
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  .icon-automated {
    font-size: 1.25rem;
    height: 1.5rem;
  }

  .automated-translation-label {
    color: $darkgrey-light;
    font-size: $font-size-base;
    line-height: 1.5;
  }
</style>
