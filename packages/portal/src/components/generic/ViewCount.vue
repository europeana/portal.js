<template>
  <div
    v-if="$features.storiesViewCounts && viewCount > 0"
    id="view-count"
    data-qa="view count"
    class="view-count d-inline-flex align-items-center pl-2"
  >
    <span
      class="icon-ic-view"
    />
    {{ $tc('views.count', viewCount, { count: $n(viewCount) }) }}
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ViewCount',

    inject: [
      'canonicalUrl'
    ],

    props: {
      url: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        viewCount: 0
      };
    },

    async fetch() {
      if (!this.$features.storiesViewCounts) {
        return;
      }

      const url = this.url || this.canonicalUrl.withOnlyQuery;

      const viewsResponse = await axios({
        baseURL: this.$config.app.baseUrl,
        method: 'get',
        params: { url },
        url: '/_api/events/views'
      });

      this.viewCount = viewsResponse.data.viewCount;
    },

    fetchOnServer: false
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  .icon-ic-view {
    padding-right: 0.375rem;
    font-size: 1.5rem;
  }

  .view-count {
    color: $mediumgrey-light;
    font-size: $font-size-base;
    line-height: 1.5;
  }
</style>
