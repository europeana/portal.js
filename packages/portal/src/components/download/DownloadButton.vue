<template>
  <b-button
    ref="downloadButton"
    :href="downloadUrl"
    :disabled="validating"
    data-qa="download button"
    class="d-inline-flex align-items-center download-button h-100 matomo_ignore"
    :target="target"
    variant="primary"
    @click.native="handleClickDownloadButton"
  >
    <slot>
      <span class="icon-ic-download d-inline-flex pr-1" />
      {{ $t('actions.download') }}
    </slot>
    <LoadingSpinner
      v-show="validating"
      tag="span"
      class="ml-2"
    />
  </b-button>
</template>

<script>
  import axios from 'axios';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import { useLogEvent } from '@/composables/logEvent.js';
  import { ITEM_URL_PREFIX } from '@/plugins/europeana/data.js';

  export default {
    name: 'DownloadButton',
    components: {
      LoadingSpinner
    },
    inject: ['canonicalUrl'],
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
      }
    },
    setup() {
      const { logEvent } = useLogEvent();
      return { logEvent };
    },
    data() {
      return {
        clicked: false,
        validating: false,
        urlValidated: false,
        validationNetworkError: false
      };
    },
    computed: {
      // Ensure we only proxy web resource media, preventing proxying of
      // arbitrary other resources such as images linked from (non-Europeana-hosted)
      // IIIF manifests.
      // downloadViaProxy() {
      //   return this.allMediaUris.some(uri => uri === url);
      // },
      downloadUrl() {
        const url = this.url;
        // FIXME: reinstate check, formerly in ItemHero
        // return this.downloadViaProxy() ? this.$apis.record.mediaProxyUrl(url, this.identifier) : url;
        return this.$apis.record.mediaProxyUrl(url, this.identifier);
      },
      isDownloadValidationRequired() {
        return !this.urlValidated && !this.validationNetworkError;
      },
      target() {
        let target = null;
        if (this.validationNetworkError || !this.downloadUrl.startsWith(this.$apis.mediaProxy.baseURL)) {
          target = '_blank';
        }
        return target;
      }
    },
    watch: {
      url() {
        this.urlValidated = false;
        this.validationNetworkError = false;
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
        this.validating = true;

        try {
          // Validate the URL with a HEAD request
          await axios({ method: 'head', url: this.downloadUrl, timeout: 15000 });
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

        this.validating = false;
      },
      captureDownloadValidationNetworkError(error) {
        this.$apm?.captureError({
          name: 'DownloadValidationNetworkError',
          message: error.message,
          item: this.identifier,
          url: this.downloadUrl
        });
      },
      captureDownloadError(error) {
        this.$apm?.captureError({
          name: 'DownloadError',
          message: error.message,
          status: error.response?.status,
          item: this.identifier,
          url: this.downloadUrl
        });
      },
      trackDownload() {
        if (!this.disabled) {
          this.logEvent('download', `${ITEM_URL_PREFIX}${this.identifier}`, this.$session);
          if (this.$matomo) {
            this.$matomo.trackLink(this.canonicalUrl.withNeitherLocaleNorQuery, 'download');
            if (!this.clicked) {
              this.$matomo.trackEvent('Item_download', 'Click download button', this.downloadUrl);
              this.clicked = true;
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  .icon-ic-download::before {
    font-size: 1.125rem;
    line-height: 1;
  }
</style>
