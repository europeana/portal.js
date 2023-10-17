<template>
  <div class="page white-page trending-page">
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-else
    >
      <ContentHeader
        :title="pageMeta.title"
      />
      <ItemPreviewCardGroup
        v-if="items"
        :items="items"
      />
    </b-container>
  </div>
</template>

<script>
  import axios from 'axios';
  import { recordIdFromUrl } from '@/plugins/europeana/record.js';
  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import ItemPreviewCardGroup from '@/components/item/ItemPreviewCardGroup';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'TrendingPage',

    components: {
      ContentHeader,
      ItemPreviewCardGroup,
      LoadingSpinner
    },

    mixins: [
      pageMetaMixin
    ],

    data() {
      return {
        items: null,
        pageMeta: {
          title: 'Trending items'
        }
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

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .trending-page {
    padding: 3rem 0 7rem;
  }
</style>
