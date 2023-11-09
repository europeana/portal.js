<template>
  <div
    id="view-count"
    data-qa="view count"
    class="view-count d-inline-flex align-items-center my-4"
  >
    <span
      class="icon-ic-view d-inline-flex pr-1"
    />
    {{ $t('views.count', { count: viewCount }) }}
    <b-tooltip
      target="view-count"
      :title="$t(`views.tooltip`)"
      boundary-padding="0"
      placement="bottom"
    />
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ViewCount',
    props: {
      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        viewCount: 0
      };
    },

    async fetch() {
      const viewsResponse = await axios.create({
        baseURL: this.$config.app.baseUrl,
        params: { url: this.url }
      }).get('/_api/events/views');

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
  }
</style>
