<template>
  <div
    v-show="items"
  >
    <h2>Trending items</h2>
    <ItemPreviewCardGroup
      v-if="items"
      :items="items"
    />
  </div>
</template>

<script>
  import axios from 'axios';
  import { recordIdFromUrl } from '@/plugins/europeana/record.js';
  import ItemPreviewCardGroup from './ItemPreviewCardGroup';

  export default {
    name: 'ItemTrendingGroup',

    components: {
      ItemPreviewCardGroup
    },

    data() {
      return {
        items: null
      };
    },

    async fetch() {
      const trendsResponse = await axios.create({
        baseURL: this.$config.app.baseUrl
      }).get('/_api/events/trends');

      const itemIds = trendsResponse.data.items.map((item) => recordIdFromUrl(item.uri));

      const findResponse = await this.$apis.record.find(itemIds);
      this.items = findResponse.items;
    }
  };
</script>
