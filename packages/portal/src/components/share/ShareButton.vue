<template>
  <b-button
    v-b-modal.share-modal
    :variant="variant"
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
  export default {
    name: 'ShareButton',

    props: {
      variant: {
        type: String,
        default: ''
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
  <ShareButton />
  ```
</docs>
