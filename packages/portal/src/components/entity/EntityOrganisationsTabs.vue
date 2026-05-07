<template>
  <b-nav
    v-if="tabs"
    tabs
    class="pl-4"
  >
    <b-nav-item
      v-for="tab in tabs"
      :key="tab.hash"
      :to="localePath({ hash: tab.hash})"
      :active="activeTabHash === tab.hash"
    >
      {{ tab.label }}
    </b-nav-item>
  </b-nav>
</template>

<script>
  import useActiveTab from '@/composables/activeTab.js';
  const HASH_PROVIDING_INSTITUTIONS = '#institutions';
  const HASH_AGGREGATORS = '#aggregators';

  export default {
    name: 'EntityOrganisationsTabs',

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

    data() {
      return {
        tabs: [{
                 label: this.$t('organisations.providingInstitutions.title'),
                 hash: HASH_PROVIDING_INSTITUTIONS
               },
               {
                 label: this.$t('organisations.aggregators.title'),
                 hash: HASH_AGGREGATORS
               }]
      };
    }
  };
    </script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/tabs';
  </style>
