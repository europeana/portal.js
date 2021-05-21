<template>
  <b-button
    v-b-modal.feedbackModal
    variant="primary"
    data-qa="feedback button"
    size="lg"
    class="feedback-button text-decoration-none"
  >
    <span class="icon-ic-feedback d-inline-flex pr-1" />
    {{ $t('actions.feedback') }}
  </b-button>
</template>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

  .feedback-button {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 1000;
    text-transform: capitalize;
    padding: 0.875rem;
    line-height: 1;
    border-color: $white;
  }
  .icon-ic-feedback {
    font-size: 1.25rem;
  }
</style>
