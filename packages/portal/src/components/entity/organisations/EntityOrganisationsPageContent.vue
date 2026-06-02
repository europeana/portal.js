<template>
  <!-- wrapped in client-only as page content was dependent on browser URL hash -->
  <!-- TODO: see if client-only can be removed  -->
  <client-only>
    <div>
      <b-col
        cols="12"
        lg="6"
        class="tab-header p-0 mb-5"
      >
        <p>{{ description }}</p>
      </b-col>
      <template v-if="tab === 'institutions'">
        <EntityTable
          type="organisations"
          class="mt-3 mt-md-4"
          :fields="['prefLabel', 'countryPrefLabel', 'recordCount', 'showDetails']"
        >
          <template #row-details="rowDetails">
            <span
              v-if="rowDetails.entity.countryPrefLabel"
              class="d-md-none"
            >{{ rowDetails.entity.countryPrefLabel }}</span>
          </template>
        </EntityTable>
      </template>
      <template v-else-if="tab === 'aggregators'">
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
                v-if="rowDetails.entity.countryPrefLabel"
                class="d-md-none"
              >{{ rowDetails.entity.countryPrefLabel }}</span>
              <span
                v-if="rowDetails.entity.heritageDomain"
                class="d-md-none"
              >{{ rowDetails.entity.heritageDomain }}</span>
              <EntityOrganisationsRelated
                :entity-id="rowDetails.entity.id"
              />
            </template>
          </EntityTable>
        </div>
      </template>
    </div>
  </client-only>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import useActiveTab from '@/composables/activeTab.js';

  const AGGREGATORS = 'aggregators';
  const INSTITUTIONS = 'institutions';

  export default {
    name: 'EntityOrganisationsPageContent',

    components: {
      ClientOnly,
      EntityOrganisationsRelated: () => import('./EntityOrganisationsRelated'),
      EntityTable: () => import('../EntityTable')
    },

    setup() {
      const tabIds = [
        AGGREGATORS,
        INSTITUTIONS
      ];

      const { activeTabId } = useActiveTab(tabIds, { replaceRoute: false, query: 'tab' });

      return {
        activeTabId
      };
    },

    computed: {
      description() {
        if (this.tab === AGGREGATORS) {
          return this.$t('organisations.aggregators.description');
        } else {
          return this.$t('organisations.providingInstitutions.description');
        }
      },
      tab() {
        return this.activeTabId || INSTITUTIONS;
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

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
