<template>
  <div
    class="page trending-page xxl-page"
  >
    <b-container>
      <ContentHeader
        :title="pageMeta.title"
      />
      <ItemTrendingItems />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';
  import ItemTrendingItems from '@/components/item/ItemTrendingItems';

  export default {
    name: 'TrendingPage',

    components: {
      ContentHeader,

      ItemTrendingItems
    },

    mixins: [
      pageMetaMixin
    ],

    computed: {
      pageMeta() {
        return {
          title: 'Trending items'
        };
      }

    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .trending-page {
    padding-bottom: 7rem;
  }
</style>
