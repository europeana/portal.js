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
                  <h2>{{ $t('apiKeys.table.heading') }}</h2>
                  <b-table
                    v-if="tableItems.length > 0"
                    striped
                    hover
                    :fields="tableFields"
                    :items="tableItems"
                  />
                  <p v-else>
                    {{ $t('apiKeys.noKeys') }}
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
  import { BTable } from 'bootstrap-vue';

  import AlertMessage from '@/components/generic/AlertMessage';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import UserHeader from '@/components/user/UserHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'AccountAPIKeysPage',

    components: {
      AlertMessage,
      BTable,
      LoadingSpinner,
      UserHeader
    },

    mixins: [
      pageMetaMixin
    ],

    middleware: 'auth',

    data() {
      return {
        tableFields: [
          { key: 'clientId', label: this.$t('apiKeys.table.fields.clientId.label') }
        ],
        tableItems: []
      };
    },

    async fetch() {
      const apiKeys = await this.$apis.auth.getUserClients();
      this.tableItems = apiKeys.map((apiKey) => ({
        clientId: apiKey['client_id']
      }));
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
