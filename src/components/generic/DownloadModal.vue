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
    >
      <p>
        {{ $t('modal.download.modalIntro') }}
      </p>
      <b-form-textarea
        id="attributionSnippet"
        ref="attributionSnippet"
        readonly
        class="snippet"
        rows="1"
        max-rows="10"
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
      data-qa="attribution snippet close"
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
      title: {
        type: String,
        default: null
      },
      creator: {
        type: String,
        default: null
      },
      year: {
        type: String,
        default: null
      },
      provider: {
        type: String,
        default: null
      },
      country: {
        type: String,
        default: null
      },
      rights: {
        type: String,
        required: true
      },
      url: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        snippetCopied: false
      };
    },

    computed: {
      attributionSnippet() {
        let attributionData = [
          this.titleCreator,
          this.year,
          this.providerCountry,
          this.rights
        ]
          .filter(value => value) // remove empty
          .join(' - ') // output as a string
          .concat('.');

        if (this.url) {
          attributionData = attributionData.concat(`\n${this.url}`);
        }

        return attributionData;
      },

      titleCreator() {
        let titleCreator;

        if (this.title && this.creator) {
          titleCreator = `${this.title} ${this.$t('blog.by')} ${this.creator}`;
        } else {
          titleCreator = this.title || this.creator;
        }

        return titleCreator;
      },

      providerCountry() {
        let providerCountry;

        if (this.provider && this.country) {
          providerCountry = `${this.provider}, ${this.country}`;
        } else {
          providerCountry = this.provider || this.country;
        }

        return providerCountry;
      }
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
  @import '@/assets/scss/variables.scss';

  #downloadModal {
    font-size: $font-size-small;

    .modal-title {
      font-size: 1.5rem;
      line-height: 1.375;

      &:after {
        content: '\2728';
        display: inline-block;
        margin-left: 0.5rem;
      }
    }

    .modal-body {
      padding-top: 0.75rem;
      p:first-child {
        margin-bottom: 0.75rem;
      }
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
      overflow-y: auto !important;
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
      margin-bottom: 1.25rem;

      span {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }
  }
</style>
