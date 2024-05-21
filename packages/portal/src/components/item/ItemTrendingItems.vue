<template>
  <section
    v-if="items"
    id="trending-items"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-6">
      <h2
        class="card-group-title"
      >
        {{ headline }}
      </h2>
    </div>
    <div class="col-12">
      <ItemPreviewCardMosaic
        :items="items"
      />
    </div>
  </section>
</template>

<script>
  import axios from 'axios';
  import { recordIdFromUrl } from '@/utils/europeana/record.js';
  import ItemPreviewCardMosaic from '@/components/item/ItemPreviewCardMosaic';

  export default {
    name: 'ItemTrendingItems',

    components: {
      ItemPreviewCardMosaic
    },

    props: {
      headline: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        items: null
      };
    },

    async fetch() {
      const trendsResponse = await axios.create({
        baseURL: this.$config.app.baseUrl
      }).get('/_api/events/trending');

      const itemIds = trendsResponse.data.items.map((item) => recordIdFromUrl(item.uri));

      const findResponse = await this.$apis.record.find(itemIds);

      // reorder based on trending
      this.items = itemIds
        .map((id) => findResponse.items.find((item) => item.id === id))
        .filter((item) => !!item);
    }
  };
</script>
