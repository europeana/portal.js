<template>
  <div
    class="xxl-page page api-keys-page mb-3 mb-sm-5"
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
                    :items="sortedPersonalKeys"
                    :tbody-tr-class="tableRowClass"
                    striped
                    class="borderless"
                  >
                    <template #cell(created)="data">
                      <time :aria-disabled="isDisabled(data.item)">
                        {{ data.value && $d(new Date(data.value), 'numeric', $i18n.localeProperties.iso) }}
                      </time>
                    </template>
                    <template #cell(client_id)="data">
                      <span
                        v-if="isDisabled(data.item)"
                        class="disabled"
                        aria-disabled="true"
                      >
                        {{ data.value }}
                        <span class="font-italic text-lowercase">- {{ $t('statuses.disabled') }}</span>
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
          { key: 'created',
            label: this.$t('apiKeys.table.fields.created.label'),
            sortable: true },
          { class: 'table-api-key-cell',
            key: 'client_id',
            label: this.$t('apiKeys.table.fields.clientId.label') },
          { class: 'table-actions-cell',
            key: 'actions',
            label: '' }
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
        return this.personalKeys.every((apiKey) => this.isDisabled(apiKey));
      },

      pageMeta() {
        return {
          title: this.$t('apiKeys.title')
        };
      },

      sortedPersonalKeys() {
        return [...this.personalKeys].sort(this.sortByEnabled);
      }
    },

    methods: {
      handleDisableApiKey() {
        this.$fetch();
      },

      async handleSubmitCreatePersonalKeyForm() {
        try {
          await this.$apis.auth.createClient();
          this.$fetch();
        } catch (error) {
          this.$error(error);
        }
      },

      isDisabled(apiKey) {
        return apiKey?.state === 'disabled';
      },

      tableRowClass(item, type) {
        if (type === 'row' && this.isDisabled(item)) {
          return 'disabled';
        }
        return undefined;
      },

      sortByEnabled(a, b) {
        const isADisabled = this.isDisabled(a);
        const isBDisabled = this.isDisabled(b);

        if (isADisabled === isBDisabled) {
          return 0;
        }
        return isADisabled ? 1 : -1;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';
  @import '@europeana/style/scss/table';

  .api-keys-page .container {
    @media (min-width: $bp-extralarge) {
      max-width: 1250px;
    }

    @media (min-width: $bp-4k) {
      max-width: 2100px;
    }
  }

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
      thead th {
        @media (max-width: ($bp-small - 1px)) {
          padding-right: 0 !important;
        }

        @media (min-width: $bp-small) {
          padding-right: 3rem !important;
        }

        @media (min-width: $bp-4k) {
          padding-right: 4.5rem !important;
        }

        &.table-api-key-cell {
          @media (min-width: $bp-small) {
            width: 100%;
          }
        }

        div {
          @media (max-width: ($bp-small - 1px)) {
            overflow-wrap: anywhere;
            white-space: wrap;
          }
        }
      }

      td {
        font-weight: 600;
        color: $darkgrey;
        line-height: 1.5;
        padding: 1.5rem 1rem;

        &.table-actions-cell {
          padding: 0;
          vertical-align: middle;
        }

        .dropdown-toggle {
          font-size: $font-size-large;

          @media (min-width: $bp-4k) {
            font-size: $font-size-large-4k;
          }
        }

        .dropdown-menu {
          box-shadow: $boxshadow-large;
          border: none;
          border-radius: 0rem;
          border-bottom-right-radius: 0.25rem;
          border-bottom-left-radius: 0.25rem;
        }

        .btn-link:focus, .btn-link:hover {
          text-decoration: none;
        }
        .btn:focus {
          box-shadow: none;
        }
      }

      tr {
        &.disabled {
          &:nth-of-type(2n+1) {
            background-color: rgba($lightergrey, 0.7);
          }

          td {
            opacity: 0.7;

            &.table-actions-cell {
              opacity: 1;
            }
          }
        }

        &:last-child td {
          border-bottom: 1px solid $middlegrey;
        }
      }
    }
  }
</style>
