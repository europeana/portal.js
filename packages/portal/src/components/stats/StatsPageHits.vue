<template>
  <b-badge
    v-show="showBadge"
  >
    {{ hits }} hits
  </b-badge>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'StatsPageHits',

    props: {
      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        hits: null
      };
    },

    computed: {
      showBadge() {
        return this.hits !== null;
      },

      // TODO: this is temporary during POC phase; remove
      pageUrl() {
        return this.url.replace(window.location.origin, 'https://www.europeana.eu');
      }
    },

    // TODO: or mounted?
    async mounted() {
      const response = await this.$axios.request({
        url: '/_api/matomo/page-hits',
        baseURL: window.location.origin,
        params: {
          url: this.pageUrl
        }
      });
      this.hits = response.data.hits;
    }
  }
</script>
