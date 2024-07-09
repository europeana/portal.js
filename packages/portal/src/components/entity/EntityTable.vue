<template>
  <div class="entity-table">
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
      class="search-form position-relative"
      inline
      @submit.stop.prevent="() => {}"
    >
      <b-form-input
        v-model="filter"
        role="searchbox"
        :placeholder="$t('pages.collections.table.searchPlaceholder')"
        :aria-label="$t('search.title')"
        data-qa="entity table filter"
      />
    </b-form>
    <b-table
      id="entity-table"
      :fields="fields"
      :items="collections"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
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
            <strong :lang="langAttribute(data.item.prefLabelLang)">{{ data.item.prefLabel }}</strong>
            <span
              v-if="data.item.altLabel"
              :lang="langAttribute(data.item.altLabelLang)"
              class="subtitle"
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
          {{ $n(data.item.recordCount) }}
        </span>
      </template>
      <template
        v-if="type === 'organisations'"
        #cell(showDetails)="row"
      >
        <b-button
          class="button-toggle button-icon-only icon-chevron"
          :class="{'show': row.detailsShowing}"
          variant="light-flat"
          @click="row.toggleDetails"
        >
          <span class="visually-hidden">
            {{ $t('pages.collections.table.showMoreData', { entity: row.item.prefLabel }) }}
          </span>
        </b-button>
      </template>
      <template
        v-if="type === 'organisations'"
        #row-details="row"
      >
        <span>{{ row.item.countryPrefLabel }}</span>
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
  import langAttributeMixin from '@/mixins/langAttribute';
  import { langMapValueForLocale } from '@europeana/i18n';

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
      europeanaEntitiesOrganizationsMixin,
      langAttributeMixin
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
        filter: this.$route?.query?.filter || null,
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.name'),
            class: 'table-name-cell'
          },
          this.type === 'organisations' && {
            key: 'countryPrefLabel',
            sortable: true,
            label: this.$t('pages.collections.table.country'),
            class: 'text-center d-none d-md-table-cell'
          },
          this.type === 'organisations' && {
            key: 'recordCount',
            sortable: true,
            label: this.$t('pages.collections.table.items'),
            class: 'text-right'
          },
          this.type === 'organisations' && {
            key: 'showDetails',
            class: 'table-toggle-cell d-md-none'
          }
        ],
        typeSingular: this.type.slice(0, -1),
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
          this.collections = collections; // Do not freeze as _showDetails prop needs to be reactive for toggling the details display on small screens
        } else {
          this.collections = collections.map(Object.freeze);
        }
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
        return `${this.$i18n.locale}/collections/${this.type}`;
      },
      currentPage() {
        return Number(this.$route?.query?.page) || 1;
      },
      sortBy: {
        get() {
          return this.sort[0] || 'prefLabel';
        },
        set(value) {
          // Switching to another column always resets ordering to ascending
          this.sort = { sortBy: value, sortDesc: false };
        }
      },
      sortDesc: {
        get() {
          return this.sort[1] === 'desc';
        },
        set(value) {
          this.sort = { sortBy: this.sortBy, sortDesc: value };
        }
      },
      sort: {
        get() {
          return this.$route?.query?.sort?.split(' ') || [null, null];
        },
        set({ sortBy, sortDesc }) {
          this.updateRouteQuery({ sort: `${sortBy} ${sortDesc ? 'desc' : 'asc'}` });
        }
      }
    },

    watch: {
      '$route.query.filter'() {
        this.filter = this.$route.query.filter;
        this.updateRouteQuery({ page: 1 });
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

        return {
          ...org,
          prefLabel: nativeNameLangMapValue.values[0],
          prefLabelLang: nativeNameLangMapValue.code,
          altLabel: englishNameLangMapValue?.values[0],
          altLabelLang: englishNameLangMapValue?.code
        };
      },
      entityRoute(slug) {
        return `/collections/${this.typeSingular}/${slug}`;
      },
      onFiltered(filteredItems) {
        this.totalResults = filteredItems.length;
        this.updateRouteQuery({ filter: this.filter });
      },
      updateRouteQuery(newQuery) {
        this.$router.push({ ...this.$route, query: { ...this.$route.query, ...newQuery } });
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/table';

  .entity-table {

    .search-form {
      margin-bottom: 1rem;

      @media (min-width: $bp-medium) {
        margin-bottom: 2rem;
      }
    }

    td.table-name-cell {
      overflow-wrap: anywhere;
    }

    th.table-toggle-cell {
      display: none;
    }

    .button-toggle {
      background-color: transparent;
      &::before {
        font-size: 0.5rem;
      }

      &.show::before {
        transform: rotateX(180deg);
      }
    }
  }
</style>
