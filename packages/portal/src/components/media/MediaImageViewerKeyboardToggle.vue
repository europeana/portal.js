<template>
  <div
    ref="keyboardtoggle"
    data-qa="media image viewer keyboard toggle"
    @keyup.escape="hideToast"
  >
    <b-button
      ref="keyboardToggle"
      class="visually-hidden"
      variant="outline-light"
      data-qa="media image viewer keyboard toggle button"
      @focus="showToast"
    >
      {{ $t('media.controls.keyboardNavigation') }}
    </b-button>
    <b-toast
      id="media-image-viewer-toast"
      ref="keyboardToast"
      static
      solid
      no-auto-hide
      no-close-button
      append-toast
      toast-class="brand-toast mt-3"
    >
      <b-button
        class="close-toast p-2 ml-2 text-white float-right"
        variant="light-flat"
        :aria-label="$t('actions.close')"
        @click="hideToast"
        @focusout="hideToast"
      >
        <span class="icon-clear" />
      </b-button>
      {{ $t('media.controls.keyboardNavigation') }}
    </b-toast>
  </div>
</template>

<script>
  export default {
    name: 'MediaImageViewerKeyboardToggle',

    methods: {
      hideToast() {
        this.$bvToast.hide('media-image-viewer-toast');
        this.$refs.keyboardToggle.focus();
      },
      showToast() {
        this.$bvToast.show('media-image-viewer-toast');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .close-toast {
    background-color: transparent;
    margin-top: -0.5rem;
    margin-right: -0.5rem;
    line-height: 1;

    .icon-clear {
      font-size: 1rem;
    }
  }

  .b-toast {
    max-width: 300px;
    position: absolute;
    top: 1rem;
    left: 0;
    right: 0;
    z-index: 1;
    margin: 0 auto;
  }
</style>
