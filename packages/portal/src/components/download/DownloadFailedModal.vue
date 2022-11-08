<template>
  <b-modal
    id="download-failed-modal"
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
        @click="$bvModal.hide('download-failed-modal')"
      >
        {{ $t('actions.close') }}
      </b-button>
      <div class="d-flex">
        <b-button
          v-if="providerUrl"
          variant="primary"
          :href="providerUrl"
          target="_blank"
          data-qa="provider link button"
        >
          {{ $t('fieldLabels.default.edmDataProvider') }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
  export default {
    name: 'DownloadFailedModal',

    props: {
      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>
