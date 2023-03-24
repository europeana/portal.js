<template>
  <div>
    <b-button
      @click="$bvModal.show(modalId)"
    >
      {{ $t('actions.transcribe') }}
    </b-button>
    <b-modal
      id="contribute-transcribe-modal"
      :title="$t('modal.transcribe.title')"
      hide-header-close
      hide-footer
      data-qa="contribute transcribe modal"
    >
      <p>
        {{ $t('modal.transcribe.message') }}
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
            v-if="transcribeUrl"
            :href="transcribeUrl"
            variant="primary"
            target="_blank"
            class="d-inline-flex align-items-center"
            data-qa="contribute transcribe button"
          >
            {{ $t('actions.transcribeNow') }}
            <span
              class="icon-external-link ml-2"
            />
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'ItemTranscribeButton',

    props: {
      transcribeUrl: {
        type: String,
        required: true
      },
      modalId: {
        type: String,
        default: 'contribute-transcribe-modal'
      }
    }
  };
</script>
