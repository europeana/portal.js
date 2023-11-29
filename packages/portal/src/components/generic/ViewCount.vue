<template>
  <b-button
    v-if="$features.storiesViewCounts && viewCount > 0"
    id="view-count"
    data-qa="view count"
    class="view-count d-inline-flex align-items-center"
  >
    <span
      class="icon-ic-view d-inline-flex pr-1"
    />
    {{ $tc('views.count', viewCount, { count: $options.filters.localise(viewCount) }) }}
  </b-button>
</template>

<script>
  import axios from 'axios';

  import canonicalUrlMixin from '@/mixins/canonicalUrl';

  export default {
    name: 'ViewCount',

    mixins: [
      canonicalUrlMixin
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

      const url = this.url || this.canonicalUrl({ fullPath: true, locale: false });

      const viewsResponse = await axios({
        baseURL: this.$config.app.baseUrl,
        method: 'get',
        params: { url },
        url: '/_api/events/views'
      });

      this.viewCount = viewsResponse.data.viewCount;
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  .icon-ic-view::before {
    font-size: 1.5rem;
    line-height: 1;
  }

  .view-count {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.5;
    color: #4d4d4d;
    padding: 0.5rem 0.75rem;
    background: rgba(0, 0, 0, 0);
    border: rgba(0, 0, 0, 0);
    &:hover {
      box-shadow: none;
    }
  }
</style>
