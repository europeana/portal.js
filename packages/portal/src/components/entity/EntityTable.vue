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
      striped
      class="borderless"
      @filtered="onFiltered"
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
      <template
        v-if="type === 'organisations'"
        #cell(aggregator)="row"
      >
        <EntityBadges
          :related-collections="row.item.aggregatedVia"
          :title="false"
        />
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
  import uniq from 'lodash/uniq';

  import LoadingSpinner from '../generic/LoadingSpinner';
  import PaginationNavInput from '@/components/generic/PaginationNavInput';
  import { organizationEntityNativeName, organizationEntityNonNativeEnglishName } from '@/utils/europeana/entities/organizations.js';
  import SmartLink from '../generic/SmartLink';
  import langAttributeMixin from '@/mixins/langAttribute';
  import { langMapValueForLocale } from '@europeana/i18n';
  import { getLabelledSlug } from '@/plugins/europeana/utils.js';

  export default {
    name: 'EntityTable',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      BTable,
      EntityBadges: () => import('./EntityBadges.vue'),
      LoadingSpinner,
      PaginationNavInput,
      SmartLink
    },

    mixins: [
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
            key: 'aggregator',
            label: this.$t('pages.collections.table.aggregator'),
            class: 'text-center d-none d-md-table-cell'
          },
          {
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
        filter: null,
        typeSingular: this.type.slice(0, -1),
        totalResults: 0,
        perPage: 40
      };
    },

    async fetch() {
      try {
        const searchResponse = await this.$apis.entity.search({
          type: this.apiType,
          scope: 'europeana',
          query: this.filter || '*:*',
          page: this.currentPage,
          pageSize: this.perPage,
          sort: 'skos_prefLabel.*'
        });
        this.totalResults = searchResponse.total;

        const entityIds = searchResponse.entities.map((e) => e.id);

        const retrieveResponse = await this.$apis.entity.retrieve(entityIds);

        let collections = entityIds.map((id) => retrieveResponse.find((entity) => entity.id === id))
          // NOTE: this should not ever be empty... but it is, due to search including entities that
          //       fetch redirects to another, and retrieve omits
          .filter(Boolean);

        const linkedIds = uniq(collections.map((entity) => [entity.country?.id].concat(entity.aggregatedVia)).flat().filter(Boolean));
        if (linkedIds.length > 0) {
          const linkedRetrieveResponse = await this.$apis.entity.retrieve(linkedIds);

          for (const entity of collections) {
            if (entity.country) {
              entity.country = linkedRetrieveResponse.find((linked) => linked.id === entity.country.id);
            }
            if (entity.aggregatedVia) {
              entity.aggregatedVia = entity.aggregatedVia.map((via) => linkedRetrieveResponse.find((linked) => linked.id === via));
            }
          }
        }

        this.collections = collections.map((entity) => this.entityData(entity));
      } catch (e) {
        // TODO: set fetch state error from message
        console.error({ statusCode: 500, message: e.toString() });
      }
    },

    computed: {
      apiType() {
        if (this.type === 'organisations') {
          return 'organization';
        } else if (this.type === 'topics') {
          return 'concept';
        } else if (this.type === 'times') {
          return 'timespan';
        } else {
          return undefined;
        }
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
      '$route.query'() {
        this.$fetch();
      }
    },

    methods: {
      organizationEntityNativeName,
      organizationEntityNonNativeEnglishName,
      entityData(entity) {
        const data = {
          id: entity.id,
          recordCount: entity.isAggregatedBy.recordCount,
          slug: getLabelledSlug(entity.id, entity.prefLabel?.en)
        };

        if (entity.type === 'Organization') {
          const nativeName = this.organizationEntityNativeName(entity);
          const nativeNameLangMapValue = langMapValueForLocale(nativeName, this.$i18n.locale);
          const englishName = this.organizationEntityNonNativeEnglishName(entity);
          const englishNameLangMapValue = englishName && langMapValueForLocale(englishName, this.$i18n.locale);
          const countryPrefLabelLangMapValue = langMapValueForLocale(entity.country.prefLabel, this.$i18n.locale);

          data.prefLabel = nativeNameLangMapValue.values[0];
          data.prefLabelLang = nativeNameLangMapValue.code;
          data.altLabel = englishNameLangMapValue?.values[0];
          data.altLabelLang = englishNameLangMapValue?.code;
          data.countryPrefLabel = countryPrefLabelLangMapValue.values[0];
          data.countryPrefLabelLang = countryPrefLabelLangMapValue.code;
          data.aggregatedVia = entity.aggregatedVia;
        } else {
          const prefLabelLangMapValue = langMapValueForLocale(entity.prefLabel, this.$i18n.locale);
          data.prefLabel = prefLabelLangMapValue.values[0];
          data.prefLabelLang = prefLabelLangMapValue.code;
        }

        return data;
      },
      entityRoute(slug) {
        return `/collections/${this.typeSingular}/${slug}`;
      },
      onFiltered() {
        this.updateRouteQuery({ filter: this.filter, page: 1 });
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
