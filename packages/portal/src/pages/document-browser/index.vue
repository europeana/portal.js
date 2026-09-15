<template>
  <div class="contentful">
    <p
      v-if="$fetchState.error"
    >
      {{ $fetchState.error.message }}
    </p>
    <ol v-else>
      <li
        v-if="!atRoot"
      >
        <nuxt-link
          :to="upLinkTo"
        >
          ..
        </nuxt-link>
      </li>
      <li
        v-for="(item, index) in listing"
        :key="index"
      >
        <nuxt-link
          v-if="item.type === 'directory'"
          :to="directoryLinkTo(item)"
        >
          [{{ item.type }}] {{ item.name }}
        </nuxt-link>
        <a
          v-else
          :href="`${baseURL}${url}${item.name}`"
        >
          [{{ item.type }}] {{ item.name }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'DocumentBrowserPage',

    // layout: 'minimal',

    data() {
      return {
        baseURL: 'https://pro-beta.europeana.eu/files/Europeana_Professional',
        listing: [],
        url: this.$route.query.url || '/'
      };
    },

    async fetch() {
      const response = await axios.request({
        baseURL: this.baseURL,
        url: this.url,
        method: 'get'
      });
      this.listing = response.data;
    },

    head() {
      return {
        title: 'Document Browser'
      };
    },

    computed: {
      atRoot() {
        return !this.url || (this.url === '/');
      },

      upLinkTo() {
        if (!this.url) {
          return null;
        }
        return { query: { url: this.url.split('/').slice(0, -2).join('/') + '/' } };
      }
    },

    watch: {
      '$route.query'() {
        this.url = this.$route.query.url || '/';
      },
      url: '$fetch'
    },

    methods: {
      directoryLinkTo(item) {
        return { query: { url: `${this.url}${item.name}/` } };
      }
    }
  };
</script>
