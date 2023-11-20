<template>
  <div
    class="page white-page trending-page xxl-page"
  >
    <b-container>
      <ContentHeader
        :title="pageMeta.title"
      />
      <TrendingItems />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';
  import TrendingItems from '@/components/trending/TrendingItems';

  export default {
    name: 'TrendingPage',

    components: {
      ContentHeader,

      TrendingItems
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
    padding: 3rem 0 7rem;
  }
</style>
