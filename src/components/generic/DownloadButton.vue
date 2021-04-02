<template>
  <b-button
    :href="url"
    :disabled="disabled"
    variant="light text-decoration-none"
    data-qa="download button"
    size="lg"
    class="download-button d-inline-flex align-items-center"
    :target="target"
  >
    <span class="ic-download d-inline-flex pr-1" />
    {{ $t('actions.download') }}
  </b-button>
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      target: {
        type: String,
        default: '_blank'
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .download-button {
    text-transform: capitalize;
    background: $offwhite;
    color: $mediumgrey;
    font-size: $font-size-small;
    border-color: transparent;
    box-shadow: none;
    border-radius: 0.25rem;
    padding: 0.375rem 0.5rem;
    .ic-download:before {
      @extend .icon-font;
      content: '\e924';
      font-size: 1.125rem;
    }
    &:hover {
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
    }
  }
</style>
