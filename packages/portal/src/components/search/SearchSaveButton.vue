<template>
  <b-button
    class="ml-auto context-label"
    @click.prevent="saveSearch"
  >
    Save this search
  </b-button>
</template>

<script>
  import {
    EUROPEANA_SET_VISIBILITY_PRIVATE
  } from '@/plugins/europeana/set';

  export default {
    name: 'SearchSaveButton',

    props: {
      title: {
        type: String,
        default: null
      },

      isDefinedBy: {
        type: String,
        default: null
      }
    },

    methods: {
      async saveSearch() {
        await this.$apis.set.create({
          isDefinedBy: this.isDefinedBy,
          title: {
            [this.$i18n.locale]: this.title
          },
          type: 'Collection',
          visibility: EUROPEANA_SET_VISIBILITY_PRIVATE
        })
      }
    }
  };
</script>
