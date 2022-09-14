<template>
  <b-button
    v-b-modal.share-modal
    data-qa="share button"
    class="share-button d-inline-flex align-items-center"
  >
    <span class="icon-share d-inline-flex pr-1" />
    {{ $t('actions.share') }}
  </b-button>
</template>

<script>
  /**
   * Button for opening the social media share modal.
   */
  export default {};
</script>

<style lang="scss" scoped>
  .icon-share {
    font-size: 1.125rem;
    line-height: 1rem;
  }

</style>

<docs lang="md">
  ```jsx
  <ShareButton />
  ```
</docs>
