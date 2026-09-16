<template>
  <div
    class="xxl-page page mb-3 mb-sm-5"
  >
    <b-container fluid>
      <h1>{{ url }}</h1>
      <LoadingSpinner
        v-if="$fetchState.pending"
        class="text-center pb-4"
      />
      <AlertMessage
        v-else-if="$fetchState.error"
        :error="$fetchState.error.message"
      />
      <b-list-group v-else>
        <b-list-group-item
          v-if="!atRoot"
        >
          <nuxt-link
            :to="upLinkTo"
          >
            ..
          </nuxt-link>
        </b-list-group-item>
        <b-list-group-item
          v-for="(item, index) in listing"
          :key="index"
        >
          <template
            v-if="item.type === 'directory'"
          >
            📁
            <nuxt-link
              :to="directoryLinkTo(item)"
            >
              {{ item.name }}
            </nuxt-link>
          </template>
          <template
            v-else
          >
            📄
            <a
              :href="`${baseURL}${url}${item.name}`"
            >
              {{ item.name }}
            </a>
          </template>
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '@/components/generic/AlertMessage';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'DocumentBrowserPage',

    components: {
      AlertMessage,
      LoadingSpinner
    },

    mixins: [
      pageMetaMixin
    ],

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

    computed: {
      atRoot() {
        return !this.url || (this.url === '/');
      },

      pageMeta() {
        return {
          title: [this.url, 'Document Browser'].join(' | ')
        };
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
