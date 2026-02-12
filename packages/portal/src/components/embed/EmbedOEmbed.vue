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
  />
</template>

<script>
  import axios from 'axios';

  import oEmbed from '@/utils/services/oembed.js';
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
      },

      // whether the url is already for the oEmbed service request itself,
      // otherwise is just the media url
      // TODO: deprecate when it is always true, i.e. when oEmbed service is always
      //       present in EDM
      service: {
        type: Boolean,
        default: false
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
      let response;
      if (this.service) {
        response = await axios.get(this.url);
      } else {
        response = await oEmbed(this.url, this.endpoint);
      }

      if (response?.data?.html) {
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
    },

    watch: {
      url() {
        this.$fetch();
      }
    }
  };
</script>
