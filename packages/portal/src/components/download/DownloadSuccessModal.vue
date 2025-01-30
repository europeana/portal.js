<template>
  <b-modal
    id="download-success-modal"
    title-tag="h2"
    :title="$t('modal.download.modalTitle')"
    header-tag="div"
    hide-header-close
    hide-footer
    data-qa="download success modal"
    @hidden="snippetCopied = false"
  >
    <p>
      {{ $t('modal.download.modalIntro') }}
    </p>
    <ItemSnippetCopyButton
      tag="cite"
      :text="attributionSnippet"
      :button-text="$t('modal.download.copyAttribution')"
      :help-text="$t('modal.download.clickToCopy')"
    />
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
  import ItemSnippetCopyButton from '@/components/item/ItemSnippetCopyButton';

  export default {
    name: 'DownloadSuccessModal',

    components: {
      ItemSnippetCopyButton
    },

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
  }
</style>
