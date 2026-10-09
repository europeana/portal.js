<template>
  <div class="page">
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <div v-else>
      <b-container class="mb-5">
        <b-row class="mb-2">
          <b-col>
            <div
              class="context-label"
            >
              {{ pageMeta.title }}
            </div>
          </b-col>
        </b-row>
      </b-container>
      <ItemPreviewInterface
        :items="items"
        :loading="$fetchState.pending"
        :per-page="perPage"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'DatasetsPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ItemPreviewInterface
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        datasets: [],
        perPage: 12,
        total: 0
      };
    },

    async fetch() {
      const response = await axios.request({
        method: 'POST',
        baseURL: 'https://cp-consumer-acceptance.dsp.acceptance.eanadev.org/api/mgmt',
        url: '/v3/catalog/request',
        headers: {
          'x-api-key': 'password'
        },
        data: {
          '@context': {
            '@vocab': 'https://w3id.org/edc/v0.0.1/ns/'
          },
          'protocol': 'dataspace-protocol-http:2025-1',
          'counterPartyId': 'did:web:identityhub.provider-acceptance.svc.cluster.local%3A7083:provider',
          'counterPartyAddress': 'https://cp-provider-acceptance.dsp.acceptance.eanadev.org/api/dsp/2025-1',
          'querySpec': {
            '@type': 'QuerySpec',
            'limit': this.perPage,
            'offset': this.offset
          }
        }
      });

      this.datasets = response.data.dataset;
      // FIXME: how do we get the actual total number?
      this.total = 96;
    },

    fetchOnServer: false,

    computed: {
      items() {
        return this.datasets.map((dataset) => {
          return {
            id: dataset['@id'],
            dataProvider: [dataset.publisher],
            dcCreatorLangAware: { en: [dataset.creator] },
            dcDescriptionLangAware: { en: [dataset.description] },
            dcTitleLangAware: { en: [dataset.title] },
            rights: [dataset.license],
            type: dataset.contentCategory
          };
        });
      },

      offset() {
        return this.perPage * (this.page - 1);
      },

      page() {
        return Number(this.$route.query.page || 1);
      },

      pageMeta() {
        return {
          title: 'Datasets'
        };
      }
    },

    watch: {
      page: '$fetch'
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/masonry';
</style>
