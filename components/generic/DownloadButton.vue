<template>
  <b-button
    :href="downloadUrl"
    :disabled="downloadDisabled"
    variant="light text-decoration-none"
    data-qa="download button"
    size="lg"
    class="download-button mr-lg-3 d-inline-flex align-items-center"
    :target="!useProxy ? '_blank' : '_self'"
  >
    <span class="ic-download d-inline-flex pr-1"></span>
    {{ $t('actions.download') }}
  </b-button>
</template>

<script>
  export default {
    props: {
      downloadUrl: {
        type: String,
        default: ''
      },
      downloadDisabled: {
        type: Boolean,
        default: false
      },
      useProxy: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .download-button {
    text-transform: capitalize;
    background: $offwhite;
    color: $mediumgrey;
    font-size: $font-size-base;
    border-color: transparent;
    box-shadow: none;
    border-radius: 0.25rem;
    padding: 0.375rem 0.5rem;
    .ic-download:before {
      @extend .icon-font;
      content: '\e924';
      font-size: 1.125rem;
    }
  }
</style>
