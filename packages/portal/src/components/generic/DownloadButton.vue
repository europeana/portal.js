<template>
  <b-button
    ref="downloadButton"
    :href="url"
    :disabled="disabled"
    data-qa="download button"
    class="download-button d-inline-flex align-items-center"
    :target="target"
    @click.native="handleClickDownloadButton"
  >
    <span class="icon-ic-download d-inline-flex pr-1" />
    {{ $t('actions.download') }}
  </b-button>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'DownloadButton',
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
      },
      identifier: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        clicked: false,
        urlValidated: false
      };
    },
    methods: {
      async handleClickDownloadButton(event) {
        if (this.urlValidated) {
          this.$bvModal.show('download-modal');
          this.trackDownload();
        } else {
          try {
            event.preventDefault();
            if (this.url.startsWith(this.$config.europeana.proxy.media.url)) {
              const response = await axios({
                method: 'get',
                url: `${this.url}&profile=debug`
              });
            } else {
              // TODO: should we not do this, in case of no CORS?
              await axios({
                method: 'head',
                url: this.url
              });
            }
          } catch (error) {
            this.$apm?.captureError({
              name: 'DownloadError',
              message: error.response.data?.error || error.message,
              status: error.response.status,
              item: this.identifier,
              url: this.url
            });
            this.$bvModal.show('download-failed-modal');
            return;
          }
          this.urlValidated = true;
          this.$refs.downloadButton.$el.click();
        }
      },
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
