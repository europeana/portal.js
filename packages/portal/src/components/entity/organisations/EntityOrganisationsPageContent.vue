<template>
  <div>
    <b-nav
      v-if="tabs"
      tabs
      class="pl-sm-4"
    >
      <b-nav-item
        v-for="tab in tabs"
        :key="tab.id"
        :to="tabRoute(tab)"
        :active="activeTabId === tab.id"
      >
        {{ tab.label }}
      </b-nav-item>
    </b-nav>
    <!-- wrapped in client-only as page content was dependent on browser URL hash -->
    <!-- TODO: see if client-only can be removed  -->
    <client-only>
      <b-col
        cols="12"
        lg="6"
        class="tab-header p-0 mb-5"
      >
        <p>{{ description }}</p>
      </b-col>
      <template v-if="activeTabId === TABS.INSTITUTIONS">
        <!-- FIXME: this table should not be showing aggregators -->
        <EntityTable
          type="organisations"
          data-qa="providingInstitutions entity table"
          class="mt-3 mt-md-4"
          :fields="['prefLabel', 'countryPrefLabel', 'aggregator', 'recordCount', 'showDetails']"
        >
          <template #row-details="rowDetails">
            <span
              v-if="rowDetails.entity.countryPrefLabel"
              class="d-lg-none"
            >{{ rowDetails.entity.countryPrefLabel }}</span>
            <EntityBadges
              v-if="(rowDetails.entity.aggregatedVia?.length || 0) > 0"
              :related-collections="rowDetails.entity.aggregatedVia"
              :title="$t('pages.collections.table.aggregator')"
              class="d-lg-none mt-3"
            />
          </template>md
        </EntityTable>
      </template>
      <template v-else-if="activeTabId === TABS.AGGREGATORS">
        <div
          v-for="type in aggregatorTypes"
          :key="type.key"
        >
          <b-col
            cols="12"
            lg="6"
            class="p-0 mb-5"
            :class="`${type.key}-header`"
          >
            <h2>{{ $t(`organisations.${type.key}.title`) }}</h2>
            <p>{{ $t(`organisations.${type.key}.description`) }}</p>
          </b-col>
          <EntityTable
            :table-id="type.key"
            type="organisations"
            sub-type="aggregators"
            :data-qa="`${type.key} entity table`"
            :filter="type.filter"
            :fields="type.fields"
            class="mt-3 mt-md-4"
            :searchable="false"
            :always-show-row-details-toggles="true"
            :per-page="null"
          >
            <template #row-details="rowDetails">
              <span
                v-if="type.fields.includes('countryPrefLabel') && rowDetails.entity.countryPrefLabel"
                class="d-lg-none"
              >{{ rowDetails.entity.countryPrefLabel }}</span>
              <span
                v-if="type.fields.includes('heritageDomain') && rowDetails.entity.heritageDomain"
                class="d-lg-none"
              >{{ rowDetails.entity.heritageDomain }}</span>
              <EntityOrganisationsRelated
                :entity-id="rowDetails.entity.id"
              />
            </template>
          </EntityTable>
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import useActiveTab from '@/composables/activeTab.js';

  const TABS = {
    AGGREGATORS: 'aggregators',
    INSTITUTIONS: 'institutions'
  };

  export default {
    name: 'EntityOrganisationsPageContent',

    components: {
      ClientOnly,
      EntityOrganisationsRelated: () => import('./EntityOrganisationsRelated'),
      EntityTable: () => import('../EntityTable'),
      EntityBadges: () => import('../EntityBadges')
    },

    setup() {
      const tabIds = [
        TABS.INSTITUTIONS,
        TABS.AGGREGATORS
      ];

      const { activeTabId } = useActiveTab(tabIds, { replaceRoute: false, query: 'tab' });

      return {
        activeTabId
      };
    },

    data() {
      return {
        tabs: [
          {
            label: this.$t('organisations.providingInstitutions.title'),
            id: TABS.INSTITUTIONS
          },
          {
            label: this.$t('organisations.aggregators.title'),
            id: TABS.AGGREGATORS
          }
        ],
        TABS
      };
    },

    computed: {
      description() {
        if (this.activeTabId === TABS.AGGREGATORS) {
          return this.$t('organisations.aggregators.description');
        } else {
          return this.$t('organisations.providingInstitutions.description');
        }
      },
      aggregatorTypes() {
        return [
          {
            key: 'internationalAggregators',
            filter: (agg) => agg.geographicScope === 'International',
            fields: ['prefLabel', 'heritageDomain', 'recordCount', 'showDetails']
          },
          {
            key: 'regionalAggregators',
            filter: (agg) => agg.geographicScope !== 'International',
            fields: ['prefLabel', 'countryPrefLabel', 'recordCount', 'showDetails']
          }
        ];
      }
    },

    methods: {
      tabRoute(tab) {
        return { ...this.$route, query: { tab: tab.id }, hash: undefined };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/tabs';

  .col-12 {
    color: $darkgrey;
    margin-top: 2rem;
  }

  h2 {
    @extend %title-3;
    color: $black;

    // TODO: remove when page is updated for 4k
    @media(min-width: $bp-4k) {
      font-size: $font-size-xl;
      margin-bottom: 1rem;
    }
  }
</style>
