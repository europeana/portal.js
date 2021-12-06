<template>
  <b-form
    v-if="embedHtml"
    data-qa="share embed"
    class="mt-3"
    @submit.stop.prevent="submitForm"
  >
    <label for="share-embed">{{ $t('record.copyEmbedLabel') }}</label>
    <b-form-textarea
      id="share-embed"
      ref="shareEmbed"
      v-model="embedHtml"
      readonly
      data-qa="share embed textarea"
      @click="copyEmbedCode"
      @keydown.enter="copyEmbedCode"
    />
    <span
      :class="{active: embedCopied}"
      class="copy-to-clipboard-success"
      data-qa="share embed copied notice"
    >
      <span class="icon-check-circle d-inline-flex pr-1" />
      {{ $t('messages.copyToClipboardSuccess') }}
    </span>
  </b-form>
</template>

<script>
  import { oEmbedForEndpoint } from '@/plugins/oembed';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  export default {
    name: 'ItemEmbedCode',

    props: {
      identifier: {
        type: String,
        required: true
      }
    },

    // TODO: write to the store the response to prevent rerequesting same on
    //       subsequent instantiations?
    async fetch() {
      const response = await oEmbedForEndpoint(process.env.EUROPEANA_OEMBED_PROVIDER_URL || 'https://oembedjs.europeana.eu',
                                               `${EUROPEANA_DATA_URL}/item${this.identifier}`);

      if (response.data.html) {
        this.embedHtml = response.data.html;
      }
    },

    data() {
      return {
        embedCopied: false,
        embedHtml: null
      };
    },

    methods: {
      copyEmbedCode() {
        this.$refs.shareEmbed.select();
        document.execCommand('copy');
        this.embedCopied = true;
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/variables';

  #share-embed {
    cursor: pointer;
    height: 3.5rem;
    padding: 0.312rem 0.625rem;
    resize: none;
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
