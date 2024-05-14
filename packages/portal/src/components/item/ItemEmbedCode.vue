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
  import { oEmbedForEndpoint } from '@europeana/oembed';
  import { data as EuropeanaDataApi } from '@europeana/apis';

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
                                               `${EuropeanaDataApi.BASE_URL}/item${this.identifier}`);

      if (response.data.html) {
        this.embedHtml = response.data.html;
      }
    },

    methods: {
      async copyEmbedCode() {
        this.$refs.shareEmbed.select();
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
