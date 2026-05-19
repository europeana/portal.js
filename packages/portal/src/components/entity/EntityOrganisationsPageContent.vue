<template>
  <div>
    <b-col
      cols="12"
      lg="6"
      class="p-0 mb-5 "
    >
      <p>{{ description }}</p>
    </b-col>
    <!-- TODO: handle different aggregator types (national / international) and add aggregator types headings and descriptions -->
    <EntityTable
      v-if="type === 'organisations'"
      :type="type"
      class="mt-3 mt-md-4"
    />
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
        if (this.type === AGGREGATORS) {
          return this.$t('organisations.aggregators.description');
        } else {
          return this.$t('organisations.providingInstitutions.description');
        }
      },
      type() {
        // TODO: handle the different types (aggregators, institutions) in EntityTable
        if (this.activeTabHash === HASH_AGGREGATORS) {
          return AGGREGATORS;
        } else {
          return 'organisations';
        }
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
</style>
