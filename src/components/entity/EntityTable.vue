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
      :items="collectionsData"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
      striped
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
          {{ data.item.prefLabel }}
        </SmartLink>
      </template>
      <template
        v-if="type === 'organisations'"
        #cell(nativeLabel)="data"
      >
        <SmartLink
          :data-qa="`collection link ${data.item.slug}`"
          :destination="entityRoute(data.item.slug)"
        >
          {{ data.item.nativeLabel }}
        </SmartLink>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import SmartLink from '../generic/SmartLink';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

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
        sortBy: 'prefLabel',
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.name')
          },
          this.type === 'organisations' && {
            key: 'nativeLabel',
            sortable: true,
            label: 'native name' // this.$t('pages.collections.table.nativeName')
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
        // For organisations, only get English labels (for now).
        return this.type === 'organisations' ?
          '/_api/cache/collections/organisations' :
          `/_api/cache/${this.$i18n.locale}/collections/${this.type}`;
      },
      collectionsData() {
        if (this.type === 'organisations' && this.collections) {
          return this.collections.map(organistation => {
            const organisationCopy = { ...organistation };
            const nativeLocale = Object.keys(organisationCopy.prefLabel).find(locale => locale !== 'en') || 'en';

            organisationCopy.nativeLabel = organisationCopy.prefLabel[nativeLocale];
            organisationCopy.prefLabel = langMapValueForLocale(organisationCopy.prefLabel, 'en').values[0];
            return organisationCopy;
          });
        } else {
          return this.collections;
        }
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
