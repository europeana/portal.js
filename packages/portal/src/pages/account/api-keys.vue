<template>
  <div
    class="xxl-page page"
  >
    <b-container fluid>
      <UserHeader />
      <b-row>
        <b-col class="p-0 mb-3">
          <b-container>
            <b-row>
              <b-col>
                <hr>
                <NuxtLink
                  :to="localePath('/account')"
                >
                  🡠 {{ $t('account.title') }}
                </NuxtLink>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <LoadingSpinner
                  v-if="$fetchState.pending"
                  class="text-center pb-4"
                />
                <AlertMessage
                  v-else-if="$fetchState.error"
                  :error="$fetchState.error.message"
                />
                <template v-else>
                  <h2>API keys</h2>
                  <ol v-if="apiKeys.length > 0">
                    <li
                      v-for="apiKey in apiKeys"
                      :key="apiKey.id"
                    >
                      {{ apiKey['client_id'] }}
                    </li>
                  </ol>
                  <p v-else>
                    You have no API keys.
                  </p>
                </template>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import AlertMessage from '@/components/generic/AlertMessage';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import UserHeader from '@/components/user/UserHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'AccountAPIKeysPage',

    components: {
      AlertMessage,
      LoadingSpinner,
      UserHeader
    },

    mixins: [
      pageMetaMixin
    ],

    middleware: 'auth',

    data() {
      return {
        apiKeys: []
      };
    },

    async fetch() {
      this.apiKeys = await this.$apis.auth.getUserClients();
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('apiKeys.title')
        };
      }
    }
  };
</script>
