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
                  <h2>{{ $t('apiKeys.sections.personalKeys.heading') }}</h2>
                  <i18n
                    path="apiKeys.sections.personalKeys.description"
                    tag="span"
                  >
                    <template #howToLink>
                      <a
                        href="https://apis.europeana.eu/#europeana-ap-is-and-how-they-work-together"
                      >
                        {{ $t('apiKeys.sections.personalKeys.howToLinkText') }}<!-- This comment removes white space
                        -->
                      </a>
                    </template>
                  </i18n>
                  <p>{{ $t('') }}</p>
                  <b-table
                    v-if="personalKeys.length > 0"
                    :fields="tableFields"
                    :items="personalKeys"
                    :tbody-tr-class="tableRowClass"
                    striped
                    hover
                  >
                    <template #cell(client_id)="data">
                      <span
                        v-if="data.item?.state === 'disabled'"
                        class="disabled"
                      >
                        {{ data.value }} — {{ $t('statuses.disabled') }}
                      </span>
                      <template v-else>
                        {{ data.value }}
                      </template>
                    </template>
                    <template #cell(actions)="data">
                      <UserApiKeyActionsMenu
                        v-if="data.item"
                        :id="`personal-api-key-actions-menu-${data.index}`"
                        :api-key="data.item"
                        @disable="handleDisableApiKey"
                      />
                    </template>
                  </b-table>
                  <p v-else>
                    {{ $t('apiKeys.noKeys') }}
                  </p>
                  <b-form
                    v-if="noActivePersonalKeys"
                    data-qa="request personal api key form"
                    @submit.prevent="handleSubmitCreatePersonalKeyForm"
                  >
                    <b-form-group>
                      <b-form-checkbox
                        id="api-keys-request-personal-key-confirm-terms-of-use"
                        v-model="confirmPersonalKeyTermsOfUse"
                      >
                        <i18n
                          path="apiKeys.sections.personalKeys.create.checkbox"
                          tag="span"
                        >
                          <template #termsOfUseLink>
                            <NuxtLink
                              to="/rights/terms-of-use#europeana-api"
                            >
                              {{ $t('apiKeys.sections.personalKeys.create.termsOfUseLinkText') }}<!-- This comment removes white space
                              -->
                            </NuxtLink>
                          </template>
                        </i18n>
                      </b-form-checkbox>
                    </b-form-group>
                    <b-button
                      :disabled="!confirmPersonalKeyTermsOfUse"
                      type="submit"
                    >
                      {{ $t('apiKeys.sections.personalKeys.create.button') }}
                    </b-button>
                  </b-form>
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
  import UserApiKeyActionsMenu from '@/components/user/UserApiKeyActionsMenu';
  import UserHeader from '@/components/user/UserHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'AccountAPIKeysPage',

    components: {
      AlertMessage,
      BTable,
      LoadingSpinner,
      UserApiKeyActionsMenu,
      UserHeader
    },

    mixins: [
      pageMetaMixin
    ],

    middleware: 'auth',

    data() {
      return {
        apiKeyToActOn: null,
        confirmPersonalKeyTermsOfUse: false,
        personalKeys: [],
        showConfirmDangerModal: false,
        tableFields: [
          { key: 'client_id', label: this.$t('apiKeys.table.fields.clientId.label') },
          { key: 'actions', label: '' }
        ]
      };
    },

    async fetch() {
      const apiKeys = await this.$apis.auth.getUserClients();
      this.personalKeys = apiKeys
        .filter((apiKey) => apiKey.type === 'PersonalKey');
    },

    computed: {
      noActivePersonalKeys() {
        return this.personalKeys.every((apiKey) => apiKey.state === 'disabled');
      },

      pageMeta() {
        return {
          title: this.$t('apiKeys.title')
        };
      }
    },

    methods: {
      handleDisableApiKey() {
        this.$fetch();
      },

      async handleSubmitCreatePersonalKeyForm() {
        await this.$apis.auth.createClient();
        this.$fetch();
      },

      tableRowClass(item, type) {
        if (type === 'row' && item?.state === 'disabled') {
          return 'disabled';
        }
        return undefined;
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .disabled {
    opacity: 70%;
    font-style: italic;
  }
</style>
