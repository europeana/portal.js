<template>
  <div
    data-qa="API requests"
  >
    <b-modal
      id="api-requests"
      size="xl"
      :title="$t('debug.apiRequests')"
      hide-footer
      data-qa="API requests modal"
      @hide="hideModal"
    >
      <InfoMessage
        v-if="!$store.getters['debug/settings'].apiKey"
        variant="icon"
      >
        <p>
          No API key has been set.
          <b-link
            href="https://pro.europeana.eu/pages/get-api"
          >
            Get an API key.
          </b-link>
          <b-link
            to="/debug"
          >
            Set your API key.
          </b-link>
        </p>
      </InfoMessage>
      <ol
        v-if="requests.length > 0"
      >
        <li
          v-for="(request, index) of requests"
          :key="index"
          data-qa="logged API request"
        >
          <code>
            {{ request.method }}
            <a
              v-if="request.method === 'GET'"
              target="_blank"
              :href="request.url"
            >
              {{ request.url }}
            </a>
            <template
              v-else
            >
              {{ request.url }}
            </template>
          </code>
        </li>
      </ol>
    </b-modal>
  </div>
</template>

<script>
  export default {
    components: {
      InfoMessage: () => import('../generic/InfoMessage')
    },

    data() {
      return {
        hash: '#api-requests'
      };
    },

    computed: {
      requests() {
        if (!this.$store.getters['debug/settings']?.apiKey) {
          return this.$store.state.axiosLogger.requests;
        }

        return this.$store.state.axiosLogger.requests.map((request) => {
          const url = new URL(request.url);
          if (url.searchParams.has('wskey')) {
            url.searchParams.set('wskey', this.$store.getters['debug/settings'].apiKey);
          }
          return {
            ...request,
            url
          };
        });
      }
    },

    watch: {
      $route(to) {
        this.$nextTick(() => {
          if (to.hash === this.hash) {
            this.showModal();
          } else {
            this.hideModal();
          }
        });
      }
    },

    mounted() {
      if (this.$route.hash === this.hash) {
        this.showModal();
      }
    },

    methods: {
      showModal() {
        this.$store.commit('debug/updateSettings', { ...this.$store.getters['debug/settings'], apiRequests: true });
        this.$bvModal.show('api-requests');
      },

      hideModal() {
        this.$bvModal.hide('api-requests');
        this.$nuxt.context.app.router.push({ ...this.$route, hash: undefined });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .modal {
    &#api-requests {
      font-family: $font-family-sans-serif;

      .modal-title {
        font-size: 1.5rem;
        font-weight: 600;
      }

      ol {
        list-style: none;
        counter-reset: item;
        padding-left: 0;
      }

      li {
        counter-increment: item;
        margin-bottom: 10px;
        line-height: 1.2;
        padding-left: 2rem;
      }

      li::before {
        content: counter(item);
        margin-left: -2rem;
        background: #e83e8c;
        border-radius: 100%;
        color: white;
        width: 1.2rem;
        text-align: center;
        display: inline-block;
      }
    }
  }
</style>
