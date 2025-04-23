<template>
  <div
    class="xxl-page page mb-3 mb-sm-5"
  >
    <b-container fluid>
      <UserHeader />
      <b-row>
        <b-col class="p-0 mb-3">
          <b-container>
            <b-row class="mb-3 pb-3 mb-sm-5">
              <b-col>
                <hr>
                <NuxtLink
                  :to="localePath('/account')"
                  class="profile-back-link context-label d-inline-flex align-items-center"
                >
                  <span class="icon-arrow-down mr-1" />
                  {{ $t('account.title') }}
                </NuxtLink>
              </b-col>
            </b-row>
            <b-row class="api-keys-page-content mb-sm-5">
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
                  <b-row>
                    <b-col
                      xl="6"
                      class="text-center text-sm-left"
                    >
                      <h2>{{ $t('apiKeys.sections.personalKeys.heading') }}</h2>
                      <i18n
                        path="apiKeys.sections.personalKeys.description"
                        tag="p"
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
                    </b-col>
                  </b-row>
                  <b-table
                    v-if="personalKeys.length > 0"
                    :fields="tableFields"
                    :items="personalKeys"
                    :tbody-tr-class="tableRowClass"
                    striped
                    hover
                    class="borderless"
                  >
                    <template #cell(client_id)="data">
                      <span
                        v-if="data.item.state === 'disabled'"
                        class="disabled"
                      >
                        {{ data.value }} — {{ $t('statuses.disabled') }}
                      </span>
                      <template v-else>
                        {{ data.value }}
                        <b-button
                          data-qa="disable personal api key button"
                          @click="handleClickDisableButton(data.item)"
                        >
                          {{ $t('actions.disable') }}
                        </b-button>
                      </template>
                    </template>
                  </b-table>
                  <b-row>
                    <b-col xl="6">
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
                                  :to="localePath('/rights/terms-of-use#europeana-api')"
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
                    </b-col>
                  </b-row>
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
        confirmPersonalKeyTermsOfUse: false,
        personalKeys: [],
        tableFields: [
          { key: 'client_id', label: this.$t('apiKeys.table.fields.clientId.label') }
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
      async handleClickDisableButton(apiKey) {
        await this.$apis.auth.deleteClient(apiKey.id);
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

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/table';

  .profile-back-link {
    font-size: $font-size-small;
    text-decoration: none;

    @media (min-width: $bp-4k) {
      font-size: $font-size-small-4k;
    }

    &:hover {
      color: $blue;
    }

    .icon-arrow-down:before {
      display: inline-block;
      transform: rotate(90deg);
      font-size: $font-size-base;

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
      }
    }
  }

  .api-keys-page-content {
    h2 {
      @extend %title-3;
    }

    p, p a, span, span a {
      color: $darkgrey;
    }

    .table {
      tr.disabled {
        opacity: 70%;
        font-style: italic;
      }

      td {
        font-weight: 600;
        color: $darkgrey;

        &:last-child {
          border-bottom: 1px solid $middlegrey;
        }
      }
    }
  }
</style>
