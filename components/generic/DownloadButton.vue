<template>
  <b-button
    v-if="url"
    :href="downloadUrl"
    :disabled="downloadDisabled"
    variant="light text-decoration-none"
    data-qa="download button"
    size="lg"
    class="download-button mr-lg-3"
    :target="!useProxy ? '_blank' : '_self'"
  >
    <span class="ic-download">⍗</span>
    {{ $t('actions.download') }}
  </b-button>
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        default: null
      },
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

  .download-button {
    text-transform: capitalize;
    background: $offwhite;
    color: $mediumgrey;
    font-size: $font-size-base;
    border-color: transparent;
    box-shadow: none;
    border-radius: 0.25rem;
  }
</style>
