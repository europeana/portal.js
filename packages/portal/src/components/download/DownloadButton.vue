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
        required: true
      },
      identifier: {
        type: String,
        required: true
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
        clicked: false,
        urlValidated: false,
        validationNetworkError: false
      };
    },
    computed: {
      isDownloadValidationRequired() {
        return this.$features.downloadValidation &&
          !this.urlValidated &&
          !this.validationNetworkError;
      }
    },
    methods: {
      async handleClickDownloadButton(event) {
        if (this.isDownloadValidationRequired) {
          // Prevent the native click event, i.e. the download
          event.preventDefault();
          await this.validateDownloadUrl();
          if (!this.isDownloadValidationRequired) {
            // Re-click the button, to trigger the download.
            this.$refs.downloadButton.$el.click();
          }
        // Either URL has been validated, or validation hit a network error, so
        // let the native link click event trigger the download, and track it.
        } else {
          this.trackDownload();
          this.$emit('download');
        }
      },
      async validateDownloadUrl() {
        try {
          // Validate the URL with a HEAD request
          await axios({ method: 'head', url: this.url });
          this.urlValidated = true;
        } catch (error) {
          // These will typically be CORS errors preventing validation. Skip
          // validation and just open the link, and log validation failure.
          if ((error.message === 'Network Error') && !error.response) {
            this.captureDownloadValidationNetworkError(error);
            this.validationNetworkError = true;
            this.$emit('validationNetworkError');
          // Other errors mean that the media can not be downloaded.
          } else {
            this.captureDownloadError(error);
            this.$emit('downloadError');
          }
        }
      },
      captureDownloadValidationNetworkError(error) {
        this.$apm?.captureError({
          name: 'DownloadValidationNetworkError',
          message: error.message,
          item: this.identifier,
          url: this.url
        });
      },
      captureDownloadError(error) {
        this.$apm?.captureError({
          name: 'DownloadError',
          message: error.message,
          status: error.response?.status,
          item: this.identifier,
          url: this.url
        });
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
