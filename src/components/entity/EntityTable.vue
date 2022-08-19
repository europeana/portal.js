<template>
  <div>
    <b-row
      v-if="$fetchState.error"
      class="flex-md-row py-4"
    >
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="collections"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
      striped
      class="borderless"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner />
          {{ $t('loading') }}
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <SmartLink
          :data-qa="`collection link ${data.item.slug}`"
          :destination="entityRoute(data.item.slug)"
        >
          <template v-if="type === 'organisations'">
            <strong :lang="data.item.nativeLabel.code">{{ data.item.nativeLabel.values[0] }}</strong>
            <span
              v-if="data.item.nonNativeEnglishLabel"
              :lang="data.item.nonNativeEnglishLabel.code"
            >
              {{ data.item.nonNativeEnglishLabel.values[0] }}
            </span>
          </template>
          <span
            v-else
          >
            {{ data.item.prefLabel }}
          </span>
        </SmartLink>
      </template>
      <template
        v-if="type === 'organisations'"
        #cell(itemCount)="data"
      >
        <span>
          {{ data.item.recordCount | localise }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'EntityTable',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      LoadingSpinner,
      SmartLink
    },
    props: {
      type: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        collections: null,
        sortBy: this.type === 'organisations' ? 'nativeLabel.values[0]' : 'prefLabel',
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.name')
          },
          this.type === 'organisations' && {
            key: 'itemCount',
            label: this.$t('pages.collections.table.items'),
            class: 'text-right'
          }
        ]
      };
    },
    fetch() {
      return this.$axios.get(this.apiEndpoint, { baseURL: window.location.origin })
        .then(response => {
          this.collections = response.data.map(Object.freeze);
        })
        .catch((e) => {
          // TODO: set fetch state error from message
          console.error({ statusCode: 500, message: e.toString() });
        });
    },
    fetchOnServer: false,
    computed: {
      apiEndpoint() {
        // For organisations, get unlocalised labels, for both English and native.
        return this.type === 'organisations' ?
          '/_api/cache/collections/organisations' :
          `/_api/cache/${this.$i18n.locale}/collections/${this.type}`;
      }
    },
    methods: {
      entityRoute(slug) {
        return {
          name: 'collections-type-all',
          params: {
            type: this.type.slice(0, -1),
            pathMatch: slug
          }
        };
      }
    }
  };
</script>
