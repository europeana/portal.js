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
      v-if="searchable"
      class="search-form position-relative"
      inline
      @submit.stop.prevent="() => {}"
    >
      <b-form-input
        v-model="query"
        role="searchbox"
        :placeholder="$t('pages.collections.table.searchPlaceholder')"
        :aria-label="$t('search.title')"
        data-qa="entity table filter"
        @change="onFiltered"
      />
    </b-form>
    <b-table
      :id="id"
      :fields="tableFields"
      :items="collections"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      striped
      class="borderless"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner
            tag="span"
          />
          {{ $t('loading') }}
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <SmartLink
          :destination="entityRoute(data.item.slug)"
        >
          <template v-if="isOrganisationsType">
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
        #cell(recordCount)="data"
      >
        <span>
          {{ $n(data.item.recordCount) }}
        </span>
      </template>
      <template
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
        #row-details="row"
      >
        <slot
          name="row-details"
          :entity="row.item"
        />
      </template>
    </b-table>
    <PaginationNavInput
      v-if="perPage"
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
  import langAttributeMixin from '@/mixins/langAttribute';
  import { backendFetch } from '@/utils/backendFetch.js';

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
      langAttributeMixin
    ],

    props: {
      /**
       * the type of entity, human-friendly, plural
       * @values organisations, topics, times
       */
      type: {
        type: String,
        required: true
      },
      /**
       * sub-type of entity, e.g. "aggregators"
       */
      subType: {
        type: String,
        default: null
      },
      /**
       * id to differentiate multiple tables
       */
      tableId: {
        type: String,
        default: null
      },
      fields: {
        type: Array,
        default: () => ['prefLabel']
      },
      /**
       * function to filter the entities to display from those received from the backend
       */
      filter: {
        type: Function,
        default: null
      },
      searchable: {
        type: Boolean,
        default: true
      },
      alwaysShowRowDetailsToggles: {
        type: Boolean,
        default: false
      },
      perPage: {
        type: Number,
        default: 40
      }
    },

    data() {
      const fields = [
        {
          key: 'prefLabel',
          sortable: true,
          label: this.$t('pages.collections.table.name'),
          class: 'table-name-cell'
        },
        {
          key: 'countryPrefLabel',
          sortable: true,
          label: this.$t('pages.collections.table.country'),
          class: 'text-center d-none d-md-table-cell'
        },
        {
          key: 'heritageDomain',
          sortable: true,
          label: this.$t('pages.collections.table.domain'),
          class: 'text-center d-none d-md-table-cell'
        },
        {
          key: 'recordCount',
          sortable: true,
          label: this.$t('pages.collections.table.items'),
          class: 'table-count-cell text-right'
        },
        {
          key: 'showDetails',
          class: `table-toggle-cell ${this.alwaysShowRowDetailsToggles ? '' : 'd-md-none'}`
        }
      ];

      return {
        collections: null,
        query: this.$route?.query?.query || null,
        tableFields: fields.filter((field) => this.displayField(field.key)),
        typeSingular: this.type.slice(0, -1),
        totalResults: this.collections?.length || 0
      };
    },

    async fetch() {
      const data = await this.fetchData();

      this.totalResults  = data.total;
      let collections = data.items;

      if (this.filter) {
        collections = collections.filter(this.filter);
      }

      if (this.type === 'organisations') {
        collections = collections.map(this.organisationData);
      }

      this.collections = collections;
    },

    computed: {
      id() {
        return this.tableId ? `entity-table-${this.tableId}` : 'entity-table';
      },
      currentPage() {
        return Number(this.$route?.query?.page) || 1;
      },
      sortQuery() {
        return this.tableId ? `${this.tableId}-sort` : 'sort';
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
          return this.$route?.query?.[this.sortQuery]?.split(' ') || ['prefLabel', 'asc'];
        },
        set({ sortBy, sortDesc }) {
          const newRouteQuery = { [this.sortQuery]: `${sortBy} ${sortDesc ? 'desc' : 'asc'}` };
          if (this.perPage) {
            newRouteQuery.page = 1;
          }
          this.updateRouteQuery(newRouteQuery);
        }
      },
      aggregatorType() {
        return this.subType === 'aggregators';
      },
      isOrganisationsType() {
        return this.type === 'organisations';
      }
    },

    watch: {
      '$route.query': {
        deep: true,
        handler() {
          this.query = this.$route.query.query;
          this.$fetch();
        }
      }
    },

    methods: {
      displayField(key) {
        return this.fields.includes(key);
      },
      fetchData() {
        let fetchType = this.type;
        if (this.subType) {
          fetchType = `${fetchType}/${this.subType}`;
        }
        const params = {
          lang: this.$i18n.locale,
          page: this.currentPage,
          pageSize: this.perPage,
          query: this.query,
          sort: this.sort.join(' ')
        };

        return backendFetch('collections', [fetchType, params], this.$nuxt.context);
      },
      organisationData(org) {
        const nativeName = Object.values(org.prefLabel)[0];
        const nativeNameLang = Object.keys(org.prefLabel)[0];
        const englishName = org.altLabel && Object.values(org.altLabel)[0];
        const englishNameLang = org.altLabel && Object.keys(org.altLabel)[0];

        return {
          ...org,
          prefLabel: nativeName,
          prefLabelLang: nativeNameLang,
          altLabel: englishName,
          altLabelLang: englishNameLang,
          ...org.heritageDomain && { heritageDomain: org.heritageDomain.join(', ') }
        };
      },
      entityRoute(slug) {
        return `/collections/${this.typeSingular}/${slug}`;
      },
      onFiltered() {
        this.updateRouteQuery({ query: this.query, page: 1 });
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
  @import '@europeana/style/scss/transitions';

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

    .b-table-details td {
      max-width: calc(100vw - 6rem);
    }
  }
</style>
