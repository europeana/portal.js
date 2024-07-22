<template>
  <AlertMessage
    v-if="$fetchState.error"
    :error="$fetchState.error"
  />
  <EmbedHTML
    v-else-if="!$fetchState.pending"
    :html="html"
    :responsive="responsiveProvider"
    :height="height"
    :width="width"
    class="mb-5"
  />
</template>

<script>
  import oEmbed from '@europeana/oembed';
  import AlertMessage from '../generic/AlertMessage';
  import EmbedHTML from './EmbedHTML';

  const RESPONSIVE_PROVIDERS = ['CCMA', 'Ina.fr', 'Sketchfab', 'Vimeo', 'YouTube'];

  export default {
    name: 'EmbedOEmbed',

    components: {
      AlertMessage,
      EmbedHTML
    },

    props: {
      url: {
        type: String,
        required: true
      },

      endpoint: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        html: null,
        width: null,
        height: null,
        providerName: null
      };
    },

    async fetch() {
      const response = await oEmbed(this.url, this.endpoint);
      if (response.data?.html) {
        this.html = response.data.html;
        this.width = response.data.width;
        this.height = response.data.height;
        this.providerName = response.data['provider_name'];
      } else {
        throw new Error(this.$t('messages.externalContentError'));
      }
    },

    computed: {
      responsiveProvider() {
        return RESPONSIVE_PROVIDERS.includes(this.providerName);
      }
    }
  };
</script>
