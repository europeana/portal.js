<template>
  <b-modal
    id="downloadModal"
    :title="$t('modal.download.modalTitle')"
    hide-header-close
    hide-footer
    data-qa="download modal"
  >
    <b-form
      data-qa="attribution snippet"
      @submit.stop.prevent="submitForm"
    >
      <p>
        {{ $t('modal.download.modalIntro') }}
      </p>
      <b-form-textarea
        id="attributionSnippet"
        ref="attributionSnippet"
        readonly
        class="snippet"
        :value="attributionSnippet"
        @click="copySnippet"
        @keydown.enter="copySnippet"
      />
      <p
        :class="{active: snippetCopied}"
        class="copy-to-clipboard-success"
      >
        <span class="icon-check_circle d-inline-flex pr-1" />
        {{ $t('messages.copyToClipboardSuccess') }}
      </p>
      <p class="help">
        <span class="icon-info-outline" />
        {{ $t('modal.download.clickToCopy') }}
      </p>
    </b-form>
    <b-button
      variant="outline-primary"
      @click="$bvModal.hide('downloadModal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  export default {
    name: 'DownloadModal',

    props: {
      attributionSnippet: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        snippetCopied: false
      };
    },

    methods: {
      copySnippet() {
        this.$refs.attributionSnippet.select();
        document.execCommand('copy');
        this.snippetCopied = true;
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

  #downloadModal {
    font-size: $font-size-small;

    .modal-title {
      font-size: 1.5rem;

      &:after {
        content: '\2728';
        display: inline-block;
        margin-left: 0.5rem;
      }
    }

    .modal-body {
      padding-top: 0;
    }

    .snippet {
      background: $whitegrey;
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      word-wrap: break-word;
      cursor: pointer;
      height: 7rem;
      font-size: $font-size-small;
      border: 0;
    }

    .copy-to-clipboard-success {
      display: none;
      vertical-align: middle;
      font-size: $font-size-small;
      &.active {
        display: inline-flex;
        align-items: center;
      }
    }

    .help {
      font-size: $font-size-extrasmall;
      color: $mediumgrey;
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }
  }
</style>
