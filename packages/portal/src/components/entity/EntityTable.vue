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
    <b-form
      class="search-form position-relative mb-4"
      inline
      @submit.stop.prevent="() => {}"
    >
      <b-form-input
        v-model="filter"
        role="searchbox"
        :placeholder="$t('pages.collections.table.searchPlaceholder')"
        :aria-label="$t('search.title')"
      />
    </b-form>
    <b-table
      id="entity-table"
      :fields="fields"
      :items="collections"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
      :filter="filter"
      :current-page="currentPage"
      :per-page="perPage"
      striped
      class="borderless"
      @filtered="onFiltered"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner />
          {{ $t('loading') }}
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <SmartLink
          :destination="entityRoute(data.item.slug)"
        >
          <template v-if="type === 'organisations'">
            <strong :lang="data.item.prefLabelLang">{{ data.item.prefLabel }}</strong>
            <span
              v-if="data.item.altLabel"
              :lang="data.item.altLabelLang"
            >
              {{ data.item.altLabel }}
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
    <PaginationNavInput
      :total-results="totalResults"
      :per-page="perPage"
      aria-controls="entity-table"
      data-qa="entity table pagination"
    />
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import LoadingSpinner from '../generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';
  import SmartLink from '../generic/SmartLink';
  import europeanaEntitiesOrganizationsMixin from '@/mixins/europeana/entities/organizations';
  import { langMapValueForLocale } from '@/plugins/europeana/utils';

  export default {
    name: 'EntityTable',
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      LoadingSpinner,
      PaginationNavInput,
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
        filter: this.$route?.query?.query || null,
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.name')
          },
          this.type === 'organisations' && {
            key: 'countryPrefLabel',
            sortable: true,
            sortDirection: 'desc',
            label: this.$t('pages.collections.organisations.table.country'),
            class: 'text-center'
          },
          this.type === 'organisations' && {
            key: 'recordCount',
            sortable: true,
            sortDirection: 'desc',
            label: this.$t('pages.collections.table.items'),
            class: 'text-right'
          }
        ],
        typeSingular: this.type.slice(0, -1),
        currentPage: Number(this.$route?.query?.page) || 1,
        totalResults: this.collections?.length || 0,
        perPage: 40
      };
    },
    async fetch() {
      try {
        const response = await this.$axios.get(this.apiEndpoint, { baseURL: window.location.origin });
        let collections = response.data[this.cacheKey];
        if (this.type === 'organisations') {
          collections = collections.map(this.organisationData);
        }
        this.collections = collections.map(Object.freeze);
      } catch (e) {
        // TODO: set fetch state error from message
        console.error({ statusCode: 500, message: e.toString() });
      }
    },
    fetchOnServer: false,
    computed: {
      apiEndpoint() {
        return `/_api/cache/${this.cacheKey}`;
      },
      cacheKey() {
        // For organisations, get unlocalised labels, for both English and native.
        return this.type === 'organisations' ?
          'collections/organisations' :
          `${this.$i18n.locale}/collections/${this.type}`;
      }
    },

    watch: {
      '$route.query.query'() {
        this.filter = this.$route.query.query;
        this.updateRouteQuery({ page: 1 });
      },
      '$route.query.page'() {
        this.currentPage = Number(this.$route?.query?.page) || 1;
      },
      'collections.length'() {
        this.totalResults  = this.collections.length;
      }
    },

    methods: {
      organisationData(org) {
        const nativeName = this.organizationEntityNativeName({ ...org, type: 'Organization' });
        const nativeNameLangMapValue = langMapValueForLocale(nativeName, this.$i18n.locale);
        const englishName = this.organizationEntityNonNativeEnglishName({ ...org, type: 'Organization' });
        const englishNameLangMapValue = englishName && langMapValueForLocale(englishName, this.$i18n.locale);
        const countryPrefLabelLangMap = langMapValueForLocale(org.countryPrefLabel, this.$i18n.locale);

        return {
          ...org,
          prefLabel: nativeNameLangMapValue.values[0],
          prefLabelLang: nativeNameLangMapValue.code,
          altLabel: englishNameLangMapValue?.values[0],
          altLabelLang: englishNameLangMapValue?.code,
          countryPrefLabel: countryPrefLabelLangMap.values[0]
        };
      },
      entityRoute(slug) {
        return `/collections/${this.typeSingular}/${slug}`;
      },
      onFiltered(filteredItems) {
        this.totalResults = filteredItems.length;
        this.updateRouteQuery({ query: this.filter });
      },
      updateRouteQuery(newQuery) {
        this.$router.push({ ...this.$route, query: { ...this.$route.query, ...newQuery } });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icons';
  @import '@europeana/style/scss/table';

  .search-form {
    border: 1px solid $bodygrey;
  }
</style>
