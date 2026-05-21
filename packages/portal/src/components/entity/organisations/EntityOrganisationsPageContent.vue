<template>
  <!-- wrap in client-only as page content is dependent on browser URL hash -->
  <client-only>
    <div>
      <b-col
        cols="12"
        lg="6"
        class="tab-header p-0 mb-5"
      >
        <p>{{ description }}</p>
      </b-col>
      <template v-if="tab === 'organisations'">
        <EntityTable
          type="organisations"
          class="mt-3 mt-md-4"
        />
      </template>
      <div
        v-for="type, index in aggregatorTypes"
        v-else-if="tab === 'aggregators'"
        :key="index"
      >
        <b-col
          cols="12"
          lg="6"
          class="p-0 mb-5"
          :class="`${type}-header`"
        >
          <h2>{{ $t(`organisations.${type}.title`) }}</h2>
          <p>{{ $t(`organisations.${type}.description`) }}</p>
        </b-col>
        <EntityTable
          :type="type"
          class="mt-3 mt-md-4"
          :searchable="false"
        />
      </div>
    </div>
  </client-only>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import useActiveTab from '@/composables/activeTab.js';
  const HASH_PROVIDING_INSTITUTIONS = '#institutions';
  const HASH_AGGREGATORS = '#aggregators';
  const AGGREGATORS = 'aggregators';

  export default {
    name: 'EntityOrganisationsPageContent',

    components: {
      ClientOnly,
      EntityTable: () => import('../EntityTable')
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
