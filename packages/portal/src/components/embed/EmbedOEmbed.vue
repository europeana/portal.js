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
  import oEmbed from '@/utils/services/oembed.js';
  import serviceForUrl from '@/utils/services/index.js';
  import AlertMessage from '../generic/AlertMessage';
  import EmbedHTML from './EmbedHTML';

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
      // TODO: deprecate if/when it is always true, i.e. when oEmbed service is always
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
        height: null
      };
    },

    async fetch() {
      const response = await oEmbed(this.mediaUrl, this.endpointUrl);

      if (response?.data?.html) {
        this.html = response.data.html;
        this.width = response.data.width;
        this.height = response.data.height;
      } else {
        throw new Error(this.$t('messages.externalContentError'));
      }
    },

    computed: {
      endpointUrl() {
        if (this.endpoint || !this.service) {
          return this.endpoint;
        }

        const serviceUrl = new URL(this.url);
        serviceUrl.search = '';
        return serviceUrl.toString();
      },

      mediaUrl() {
        if (!this.service) {
          return this.url;
        }

        const serviceUrl = new URL(this.url);
        return serviceUrl.searchParams.get('url');
      },

      responsiveProvider() {
        return !!serviceForUrl(this.mediaUrl)?.responsive;
      }
    },

    watch: {
      endpointUrl() {
        this.$fetch();
      },

      mediaUrl() {
        this.$fetch();
      }
    }
  };
</script>
