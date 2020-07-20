<template>
  <b-button
    v-b-modal.shareModal
    variant="light text-decoration-none"
    data-qa="share button"
    size="lg"
    class="share-button mr-lg-3 d-inline-flex align-items-center"
  >
    <span class="icon-share d-inline-flex pr-1" />
    {{ $t('actions.share') }}
  </b-button>
</template>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';
  @import './assets/scss/icons.scss';

  .share-button {
    text-transform: capitalize;
    background: $offwhite;
    color: $mediumgrey;
    font-size: $font-size-small;
    border-color: transparent;
    box-shadow: none;
    border-radius: 0.25rem;
    padding: 0.375rem 0.5rem;
    span {
      font-size: 1.125rem;
    }
  }
</style>
