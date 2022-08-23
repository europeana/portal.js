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
    <b-form-group
      label="Filter"
      label-for="filter-input"
    >
      <b-input-group>
        <b-form-input
          id="filter-input"
          v-model="filter"
          type="search"
          placeholder="Type to Search"
        />

        <b-input-group-append>
          <b-button
            :disabled="!filter"
            @click="filter = ''"
          >
            Clear
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-pagination
      v-model="currentPage"
      :total-rows="3000"
      :per-page="perPage"
    />
    <b-table
      :fields="fields"
      :items="collections"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
      :filter="filter"
      :filter-included-fields="['prefLabel']"
      :current-page="currentPage"
      :per-page="perPage"
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
        #cell(recordCount)="data"
      >
        <span>
          {{ data.item.recordCount | localise }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<script>
  import { BTable, BPagination } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import SmartLink from '../generic/SmartLink';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';
  import { langMapValueForLocale } from '@/plugins/europeana/utils';

  export default {
    name: 'EntityTable',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      BPagination,
      LoadingSpinner,
      SmartLink
    },
    mixins: [
      europeanaEntitiesOrganizationsMixin
    ],
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
            formatter: (value, key, item) => {
              return item.nativeLabel.values[0];
            },
            sortable: true,
            sortByFormatted: this.type === 'organisations',
            label: this.$t('pages.collections.table.name')
          },
          this.type === 'organisations' && {
            key: 'recordCount',
            sortable: true,
            sortDirection: 'desc',
            label: this.$t('pages.collections.table.items'),
            class: 'text-right'
          }
        ],
        filter: null,
        currentPage: 1,
        perPage: 100
      };
    },
    fetch() {
      return this.$axios.get(this.apiEndpoint, { baseURL: window.location.origin })
        .then(response => {
          if (this.type === 'organisations') {
            this.collections = response.data.map(org => {
              const nativeName = this.organizationEntityNativeName({ ...org, type: 'Organization' });
              const englishName = this.organizationEntityNonNativeEnglishName({ ...org, type: 'Organization' });
              return {
                ...org,
                nativeLabel: langMapValueForLocale(nativeName),
                nonNativeEnglishLabel: englishName && langMapValueForLocale(englishName)
              };
            }).map(Object.freeze);
          } else {
            this.collections = response.data.map(Object.freeze);
          }
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
