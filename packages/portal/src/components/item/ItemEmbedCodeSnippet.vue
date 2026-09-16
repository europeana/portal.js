<template>
  <ShareSnippet
    v-if="!$fetchState.pending && !$fetchState.error && code"
    tag="code"
    :text="code"
    :button-text="$t('record.actions.copyEmbedCode')"
    :help-text="$t('record.clickToCopyEmbedCode')"
  />
</template>

<script>
  import { oEmbedForEndpoint } from '@/utils/services/oembed.js';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import ShareSnippet from '@/components/share/ShareSnippet';

  export default {
    name: 'ItemEmbedCodeSnippet',

    components: {
      ShareSnippet
    },

    props: {
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        code: null
      };
    },

    async fetch() {
      const response = await oEmbedForEndpoint(this.$config?.europeana?.oembed?.providerUrl || 'https://oembed.europeana.eu',
                                               `${EUROPEANA_DATA_URL}/item${this.identifier}`);

      if (response.data.html) {
        this.code = response.data.html;
      }
    }
  };
</script>
