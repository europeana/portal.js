<template>
  <b-modal
    :id="modalId"
    :title="$t('modal.downloadFailed.title')"
    hide-footer
    hide-header-close
  >
    <p>
      {{ $t('modal.downloadFailed.message') }}
    </p>
    <p
      v-if="providerUrl"
    >
      {{ $t('modal.downloadFailed.linkPrompt') }}
    </p>
    <div class="modal-footer">
      <b-button
        variant="outline-primary"
        data-qa="close button"
        @click="$bvModal.hide(modalId)"
      >
        {{ $t('actions.close') }}
      </b-button>
      <div class="d-flex">
        <b-button
          v-if="providerUrl"
          :href="providerUrl"
          variant="primary"
          target="_blank"
          class="d-inline-flex align-items-center"
          data-qa="provider link button"
        >
          {{ $t('fieldLabels.default.edmDataProvider') }}
          <span
            class="icon-external-link ml-2"
          />
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'DownloadFailedModal',

    props: {
      /**
       * ID of the modal
       */
      modalId: {
        type: String,
        default: 'download-failed-modal'
      },

      /**
       * URL to the media on the provider's site
       */
      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>

<docs lang="md">
  Without provider URL:
  ```jsx
  <div>
    <b-button
      @click="$bvModal.show('download-failed-modal-without-provider-url')"
    >
      Show
    </b-button>
    <DownloadFailedModal
      modal-id="download-failed-modal-without-provider-url"
    />
  </div>
  ```

  With provider URL:
  ```jsx
  <div>
    <b-button
      @click="$bvModal.show('download-failed-modal-with-provider-url')"
    >
      Show
    </b-button>
    <DownloadFailedModal
      modal-id="download-failed-modal-with-provider-url"
      provider-url="https://example.org/"
    />
  </div>
  ```
</docs>
