<template>
  <div>
    <b-button
      class="transcribe-button icon-transcribe-outlined button-icon-only"
      data-qa="transcribe button"
      :aria-label="$t('actions.transcribe')"
      @click="$bvModal.show(modalId)"
    />
    <b-modal
      id="contribute-transcribe-modal"
      :title="$t('modal.transcribe.title')"
      hide-header-close
      hide-footer
      data-qa="transcribe modal"
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
            data-qa="transcribe link"
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
      /**
       * URL the button links to
       */
      transcribeUrl: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        modalId: 'contribute-transcribe-modal'
      };
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
@import '@europeana/style/scss/mixins';

.transcribe-button {
  font-size: $font-size-large;
  height: 2.25rem;
  max-width: 2.25rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  position: relative;
  border: none;
  @include status-indicator;

  &:hover {
    color: $darkgrey;

    &.icon-transcribe-outlined::before {
      content: '\e916';
    }
  }

  &::after {
    right: 8px;
    top: 8px;
  }
}

::v-deep .modal-title {
  &::after {
    content: '\1F58A';
    display: inline-block;
    margin-left: 0.5rem;
  }
}
</style>

<docs lang="md">
```jsx
<ItemTranscribeButton
  transcribe-url="/"
/>
```
</docs>
