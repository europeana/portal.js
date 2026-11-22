<template>
  <div class="page">
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <div
      v-else
      data-qa="user gallery page"
    >
      <b-container class="mb-5">
        <b-row class="mb-2">
          <b-col>
            <div
              class="context-label"
            >
              Dataset
            </div>
            <h1>
              {{ pageMeta.title }}
            </h1>
            <p
              class="mb-3 w-75"
            >
              {{ dataset.description }}
            </p>
          </b-col>
        </b-row>
        <b-row
          class="mb-3"
        >
          <b-col>
            <RightsStatementButton
              :disabled="!rightsStatementIsUrl"
              :rights-statement="rightsStatement"
              class="mr-auto"
              data-qa="provider name"
            />
          </b-col>
        </b-row>
        <b-row
          class="provider-row mb-3"
        >
          <b-col
            cols="12"
            class="col-lg-10"
          >
            <ItemDataProvider
              :data-provider="{ def: [dataset.publisher] }"
            />
          </b-col>
        </b-row>
        <b-row class="mb-3 justify-content-center">
          <b-col
            cols="12"
            class="col-lg-10 mt-3"
          >
            <MetadataBox
              :metadata="metadata"
            />
          </b-col>
        </b-row>
        <!-- <pre><code>{{ dataset }}</code></pre> -->
      </b-container>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import pageMetaMixin from '@/mixins/pageMeta';
  import ItemDataProvider from '@/components/item/ItemDataProvider';
  import MetadataBox from '@/components/metadata/MetadataBox';
  import RightsStatementButton from '@/components/generic/RightsStatementButton';

  export default {
    name: 'DatasetPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner'),
      MetadataBox,
      ItemDataProvider,
      RightsStatementButton
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        dataset: null
      };
    },

    async fetch() {
      const response = await axios.request({
        method: 'POST',
        baseURL: 'https://cp-consumer-acceptance.dsp.acceptance.eanadev.org/api/mgmt',
        url: '/v3/catalog/dataset/request',
        headers: {
          'x-api-key': 'password'
        },
        data: {
          '@context': {
            '@vocab': 'https://w3id.org/edc/v0.0.1/ns/'
          },
          '@id': this.$route.params.pathMatch,
          'protocol': 'dataspace-protocol-http:2025-1',
          'counterPartyId': 'did:web:identityhub.provider-acceptance.svc.cluster.local%3A7083:provider',
          'counterPartyAddress': 'https://cp-provider-acceptance.dsp.acceptance.eanadev.org/api/dsp/2025-1'
        }
      });

      this.dataset = response.data;
    },

    fetchOnServer: false,

    computed: {
      metadata() {
        return {
          edmDataProvider: this.dataset.publisher && { def: [this.dataset.publisher] },
          dcCreator: this.dataset.creator && { en: [this.dataset.creator] },
          dcDescription: this.dataset.description && { en: [this.dataset.description] },
          dcTitle: this.dataset.title && { en: [this.dataset.title] },
          dcType: this.dataset.type && { def: [this.dataset.type] },
          dctermsIssued: this.dataset.issued && { def: [this.dataset.issued] },
          edmRights: this.dataset.license && { def: [this.dataset.license] }
        };
      },

      pageMeta() {
        return {
          title: this.dataset?.title
        };
      },

      rightsStatementIsUrl() {
        return /^https?:\/\//.test(this.rightsStatement || '');
      },

      rightsStatement() {
        return this.dataset?.license;
      }
    },

    // watch: {
    //   page: '$fetch'
    // }
  };
</script>
