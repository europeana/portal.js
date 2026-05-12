<template>
  <div>
    <b-col
      cols="12"
      lg="6"
      class="p-0 mb-5 "
    >
      <p>{{ description }}</p>
    </b-col>
    <client-only v-if="tab === 'organisations'">
      <EntityTable
        type="organisations"
        class="mt-3 mt-md-4"
      />
    </client-only>
    <div
      v-for="aggregator, index in aggregatorTypes"
      v-else
      :key="index"
    >
      <b-col
        cols="12"
        lg="6"
        class="p-0 mb-5 "
      >
        <h2>{{ $t(`organisations.${aggregator}.title`) }}</h2>
        <p>{{ $t(`organisations.${aggregator}.description`) }}</p>
      </b-col>
      <client-only>
        <EntityTable

          :type="aggregator"
          class="mt-3 mt-md-4"
          :searchable="false"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
  import useActiveTab from '@/composables/activeTab.js';
  const HASH_PROVIDING_INSTITUTIONS = '#institutions';
  const HASH_AGGREGATORS = '#aggregators';
  const AGGREGATORS = 'aggregators';

  export default {
    name: 'EntityOrganisationsPageContent',

    components: {
      EntityTable: () => import('@/components/entity/EntityTable')
    },

    setup() {
      const tabHashes = [
        HASH_PROVIDING_INSTITUTIONS,
        HASH_AGGREGATORS
      ];

      const { activeTabHash } = useActiveTab(tabHashes, { replaceRoute: false });

      return {
        activeTabHash
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
        // TODO: handle the different types (aggregators, institutions) in EntityTable
        if (this.activeTabHash === HASH_AGGREGATORS) {
          return AGGREGATORS;
        } else {
          return 'organisations';
        }
      },
      aggregatorTypes() {
        return ['internationalAggregators', 'regionalAggregators'];
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
  }
</style>
