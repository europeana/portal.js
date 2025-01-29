<template>
  <div
    v-if="embedHtml"
    data-qa="share embed"
    class="position-relative mt-3"
  >
    <b-button
      variant="light-flat"
      class="copy-button p-0 pb-2"
      data-qa="share embed button"
      @click="copyEmbedCode"
      @keydown.enter="copyEmbedCode"
    >
      {{ $t('record.copyEmbedLabel') }}
    </b-button>
    <code
      id="share-embed"
      class="snippet"
    >
      {{ embedHtml }}
    </code>
    <span
      :class="{ active: embedCopied }"
      class="copy-to-clipboard-success"
      data-qa="share embed copied notice"
    >
      <span class="icon-check-circle d-inline-flex pr-1" />
      {{ $t('messages.copyToClipboardSuccess') }}
    </span>
  </div>
</template>

<script>
  import { oEmbedForEndpoint } from '@/utils/services/oembed.js';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  export default {
    name: 'ItemEmbedCode',

    props: {
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        embedCopied: false,
        embedHtml: null
      };
    },

    // TODO: write to the store the response to prevent rerequesting same on
    //       subsequent instantiations?
    async fetch() {
      // TODO: this should be read from Nuxt runtime config
      const response = await oEmbedForEndpoint(process.env.EUROPEANA_OEMBED_PROVIDER_URL || 'https://oembed.europeana.eu',
                                               `${EUROPEANA_DATA_URL}/item${this.identifier}`);

      if (response.data.html) {
        this.embedHtml = response.data.html;
      }
    },

    methods: {
      async copyEmbedCode() {
        try {
          await navigator.clipboard.writeText(this.embedHtml);
        } catch {
          // don't worry
        }
        this.embedCopied = true;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .copy-button {
    border: 0;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    &:hover + .snippet {
      border: 1px solid $blue;
    }
  }

  .snippet {
    color: $mediumgrey;
    border: 1px solid $mediumgrey;
    border-radius: 6px;
    padding: 0.75rem;
    font-size: $font-size-extrasmall;
    display: inline-block;
    margin: 0;
    max-width: 100%;
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
</style>
