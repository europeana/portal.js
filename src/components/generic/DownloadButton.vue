<template>
  <b-button
    v-b-modal.download-modal
    :href="url"
    :disabled="disabled"
    data-qa="download button"
    class="download-button d-inline-flex align-items-center"
    :target="target"
    @click.native="trackDownload"
  >
    <span class="icon-ic-download d-inline-flex pr-1" />
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
    },
    data() {
      return {
        clicked: false
      };
    },
    methods: {
      trackDownload() {
        if (!this.disabled && this.$matomo && !this.clicked) {
          this.$matomo.trackEvent('Item_download', 'Click download button', this.url);
          this.clicked = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .icon-ic-download::before {
    font-size: 1.125rem;
    line-height: 1;
  }
</style>
