<template>
  <b-container data-qa="debug page">
    <ContentHeader
      :title="title"
    />
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <b-form>
          <b-form-group
            label="Endpoint"
            label-for="debug-oembed-endpoint"
          >
            <b-form-input
              id="debug-oembed-endpoint"
              v-model="endpoint"
              name="endpoint"
            />
          </b-form-group>

          <b-form-group
            label="URL"
            label-for="debug-oembed-url"
          >
            <b-form-input
              id="debug-oembed-url"
              v-model="url"
              name="url"
            />
          </b-form-group>

          <b-button
            type="submit"
            variant="primary"
          >
            {{ $t('actions.preview') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row class="flex-md-row pb-5">
      <b-col cols="12">
        <client-only>
          <HTMLEmbed
            v-if="oEmbedData"
            :html="oEmbedData.html"
            :provider="oEmbedData.provider_name"
            :height="oEmbedData.height"
            :width="oEmbedData.width"
            :error="oEmbedData.error"
          />
        </client-only>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import HTMLEmbed from '@/components/generic/HTMLEmbed';
  import oEmbed from '@/plugins/oembed';

  export default {
    name: 'DebugOEmbedPage',

    components: {
      ContentHeader,
      HTMLEmbed
    },

    data() {
      return {
        endpoint: this.$route.query.endpoint,
        url: this.$route.query.url,
        oEmbedData: null,
        title: 'oEmbed'
      };
    },

    async mounted() {
      if (!this.endpoint || !this.url) {
        return;
      }

      try {
        const response = await oEmbed(this.url, this.endpoint);
        if (response.data && response.data.html) {
          this.oEmbedData = response.data;
        } else {
          this.oEmbedData = { error: this.$t('messages.externalContentError') };
        }
      } catch (error) {
        this.oEmbedData = { error: error.message };
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.title)
      };
    }
  };
</script>
