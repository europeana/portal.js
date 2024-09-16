<template>
  <ItemMediaPresentation
    v-if="$features.newMediaPresentation"
    :uri="uri"
    :web-resources="webResources"
    :item-id="itemId"
    :edm-type="edmType"
    :search-query="searchQuery"
    :provider-url="provider-url"
  />
  <ItemMediaLegacy
    v-else
    :uri="uri"
    :web-resources="webResources"
    :item-id="itemId"
    :edm-type="edmType"
    :search-query="searchQuery"
    :provider-url="provider-url"
  />
</template>

<script>
  export default {
    name: 'ItemMediaSwitch',

    components: {
      ItemMediaLegacy: () => import('./ItemMediaLegacy.vue'),
      ItemMediaPresentation: () => import('./ItemMediaPresentation.vue')
    },

    props: {
      uri: {
        type: String,
        default: null
      },

      webResources: {
        type: Array,
        default: null
      },

      itemId: {
        type: String,
        default: null
      },

      edmType: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>
