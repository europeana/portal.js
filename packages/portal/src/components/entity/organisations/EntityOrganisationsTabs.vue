<template>
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

      const { activeTabHash, activeTabId } = useActiveTab(tabHashes, { replaceRoute: false });

      return {
        activeTabHash,
        activeTabId
      };
    },

    data() {
      return {
        tabs: [
          {
            label: this.$t('organisations.providingInstitutions.title'),
            hash: HASH_PROVIDING_INSTITUTIONS,
            id: 'institutions'
          },
          {
            label: this.$t('organisations.aggregators.title'),
            hash: HASH_AGGREGATORS,
            id: 'aggregators'
          }
        ]
      };
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
  </style>
