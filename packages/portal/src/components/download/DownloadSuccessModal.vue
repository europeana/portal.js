<template>
  <b-modal
    id="download-success-modal"
    :title="$t('modal.download.modalTitle')"
    hide-header-close
    hide-footer
    data-qa="download success modal"
    @hidden="snippetCopied = false"
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
      @click="$bvModal.hide('download-success-modal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  import stringify from '@/mixins/stringify';

  export default {
    name: 'DownloadSuccessModal',

    mixins: [
      stringify
    ],

    props: {
      title: {
        type: String,
        default: null
      },
      creator: {
        type: [String, Object],
        default: null
      },
      year: {
        type: [String, Object],
        default: null
      },
      provider: {
        type: [String, Object],
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
        snippetCopied: false,
        providerString: this.stringify(this.provider),
        creatorString: this.stringify(this.creator),
        yearString: this.stringify(this.year)
      };
    },

    computed: {
      attributionSnippet() {
        let attributionData = [
          this.titleCreator,
          this.yearString,
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

        if (this.title && this.creatorString) {
          titleCreator = `${this.title} ${this.$t('authored.by')} ${this.creatorString}`;
        } else {
          titleCreator = this.title || this.creatorString;
        }

        return titleCreator;
      },

      providerCountry() {
        let providerCountry;

        if (this.providerString && this.country) {
          providerCountry = `${this.providerString}, ${this.country}`;
        } else {
          providerCountry = this.providerString || this.country;
        }

        return providerCountry;
      }
    },

    methods: {
      async copySnippet() {
        this.$refs.attributionSnippet.select();
        try {
          await navigator.clipboard.writeText(this.attributionSnippet);
        } catch {
          // don't worry
        }
        this.snippetCopied = true;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  #download-success-modal {
    font-size: $font-size-small;

    .modal-title {
      font-size: 1.5rem;
      line-height: 1.375;

      &::after {
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
      color: $darkgrey;
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
