<template>
  <div class="page white-page">
    <b-container data-qa="debug oembed page">
      <ContentHeader
        :title="pageMeta.title"
      />
      <b-row class="flex-md-row pb-5">
        <b-col cols="12">
          <b-form
            @submit.stop.prevent="handleSubmitForm"
          >
            <b-form-group
              label="Endpoint"
              label-for="debug-oembed-endpoint"
            >
              <b-form-input
                id="debug-oembed-endpoint"
                v-model="formEndpoint"
                name="endpoint"
              />
            </b-form-group>

            <b-form-group
              label="URL"
              label-for="debug-oembed-url"
            >
              <b-form-input
                id="debug-oembed-url"
                v-model="formUrl"
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
            <EmbedOEmbed
              v-if="url && endpoint"
              :url="url"
              :endpoint="endpoint"
            />
          </client-only>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import ContentHeader from '@/components/content/ContentHeader';
  import EmbedOEmbed from '@/components/embed/EmbedOEmbed';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'DebugOEmbedPage',

    components: {
      ClientOnly,
      ContentHeader,
      EmbedOEmbed
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        endpoint: null,
        url: null,
        formEndpoint: null,
        formUrl: null
      };
    },

    fetch() {
      this.url = this.$route.query.url;
      this.formUrl = this.url;

      this.endpoint = this.$route.query.endpoint;
      this.formEndpoint = this.endpoint;
    },

    computed: {
      pageMeta() {
        return {
          title: 'oEmbed'
        };
      }
    },

    watch: {
      '$route.query.url': '$fetch',
      '$route.query.endpoint': '$fetch'
    },

    methods: {
      handleSubmitForm() {
        this.$router.push({ ...this.$route, ...{ query: { url: this.formUrl, endpoint: this.formEndpoint } } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .page {
    padding: 3rem 0 7rem;
  }
</style>
