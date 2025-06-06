<template>
  <div
    data-qa="API requests"
  >
    <b-modal
      id="api-requests"
      size="xl"
      hide-footer
      data-qa="API requests modal"
      @hide="hideModal"
    >
      <template #modal-header="{ close }">
        <SmartLink
          destination="https://apis.europeana.eu"
          class="logo"
          hide-external-icon
        >
          <img
            :src="logoSrc"
            :alt="$t('landing.apis.header.homeLinkAlt')"
            data-qa="logo"
          >
        </SmartLink>
        <b-button
          class="button-icon-only icon-clear"
          variant="light-flat"
          :aria-label="$t('actions.close')"
          @click="close()"
        />
      </template>
      <b-form
        class="mb-5"
        @submit.stop.prevent="saveApiKey"
      >
        <b-form-group
          :label="$t('debug.apiRequests.form.apiKey.label')"
          label-for="debug-input-api-key"
        >
          <b-form-input
            id="debug-input-api-key"
            v-model="apiKey"
          />
          <template
            #description
          >
            <i18n
              v-if="userApiKey"
              path="debug.apiRequests.form.apiKey.usePersonal.prompt"
              tag="span"
            >
              <template #link>
                <b-button
                  v-if="userApiKey"
                  variant="link"
                  @click="handleClickUsePersonalApiKey"
                >
                  {{ $t('debug.apiRequests.form.apiKey.usePersonal.linkText') }}
                </b-button>
              </template>
            </i18n>
            <span v-else>{{ $t('debug.apiRequests.form.apiKey.descriptionLine1') }}</span>
            <br>
            <i18n
              path="debug.apiRequests.form.apiKey.descriptionLine2"
              tag="span"
            >
              <template #link>
                <SmartLink
                  :destination="$features.manageApiKeys ? '/account/api-keys' : 'https://pro.europeana.eu/pages/get-api'"
                  hide-external-icon
                >
                  {{ $t('debug.apiRequests.form.apiKey.here') }}<!-- This comment removes white space
                  -->
                </SmartLink>
              </template>
            </i18n>
          </template>
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
          data-qa="save api key button"
        >
          {{ $t('actions.save') }}
        </b-button>
      </b-form>
      <template
        v-if="requests && requests.length > 0"
      >
        <ol>
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
      </template>
      <InfoMessage
        v-else
        variant="icon"
      >
        {{ $t('debug.apiRequests.noRequests') }}
      </InfoMessage>
    </b-modal>
  </div>
</template>

<script>
  import InfoMessage from '../generic/InfoMessage';
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'DebugApiRequests',

    components: {
      InfoMessage,
      SmartLink
    },

    data() {
      return {
        apiKey: this.$store.getters['debug/settings'].apiKey,
        hash: '#api-requests',
        logoSrc: require('@europeana/style/img/landing/apis-logo.svg'),
        userApiKey: null
      };
    },

    async fetch() {
      if (!this.$auth.loggedIn || !this.$features.manageApiKeys) {
        return;
      }
      const userApiKeys = await this.$apis.auth.getUserClients();
      this.userApiKey = userApiKeys
        .find((apiKey) => (apiKey.type === 'PersonalKey') && (apiKey.state !== 'disabled')) || null;
    },

    computed: {
      requests() {
        if (!this.$store.state.axiosLogger) {
          return null;
        }
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
            url: url.toString()
          };
        });
      }
    },

    watch: {
      $route(to, from) {
        this.$nextTick(() => {
          if (to.hash === this.hash) {
            this.showModal();
          } else if (from.hash === this.hash) {
            this.hideModal({ updateRoute: false });
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
      handleClickUsePersonalApiKey() {
        this.apiKey = this.userApiKey['client_id'];
      },

      showModal() {
        this.$bvModal.show('api-requests');
      },

      hideModal({ updateRoute = true } = {}) {
        this.$bvModal.hide('api-requests');
        if (updateRoute) {
          this.$nuxt.context.app.router.push({ ...this.$route, hash: undefined });
        }
      },
      saveApiKey() {
        this.$store.commit('debug/updateSettings', {
          ...this.$store.getters['debug/settings'],
          apiKey: this.apiKey
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .modal {
    &#api-requests {
      font-family: $font-family-sans-serif;

      ol {
        list-style: none;
        counter-reset: item;
        padding-left: 0;
      }

      li {
        counter-increment: item;
        margin-bottom: 0.625rem;
        line-height: 1.2;
        padding-left: 2rem;

        @media (min-width: $bp-4k) {
          margin-bottom: 1.25rem;
        }

        &:before {
          content: counter(item);
          margin-left: -2rem;
          background: #e83e8c;
          border-radius: 100%;
          color: $white;
          width: 1.2em;
          text-align: center;
          display: inline-block;
        }
      }

      .logo img {
        @media (min-width: $bp-4k) {
          height: 46px;
        }
      }
    }
  }

  ::v-deep .form-text .btn-link {
    font-size: inherit;
    padding: 0;
    border: none;
    vertical-align: baseline;
  }

  ::v-deep .alert {
    padding: 0;
    margin-bottom: 0;
  }
</style>
