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
                      class="text-center text-sm-left mb-sm-3"
                    >
                      <div
                        v-html="parseMarkdown(namedSections.personalApiKey)"
                      />
                    </b-col>
                  </b-row>
                  <template
                    v-if="personalKeys.length > 0"
                  >
                    <div
                      v-html="parseMarkdown(namedSections.yourPersonalKey)"
                    />
                    <UserApiKeysTable
                      :api-keys="personalKeys"
                      :is-disabled="isDisabled"
                      class="mb-3 mb-sm-5"
                      data-qa="personal api keys table"
                      @keyDisabled="handleDisableApiKey"
                    />
                  </template>
                  <b-row v-if="noActivePersonalKeys">
                    <b-col xl="6">
                      <b-form
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
                                  target="_blank"
                                >
                                  {{ $t('apiKeys.sections.termsOfUseLinkText') }}
                                  <span class="icon-external-link" /><!-- This comment removes white space
                                  --><span class="sr-only">
                                    ({{ $t('newWindow') }})
                                  </span>
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
                  <b-row>
                    <b-col
                      xl="6"
                      class="text-center text-sm-left mt-3 mt-sm-5 mb-sm-3"
                    >
                      <div
                        v-html="parseMarkdown(namedSections.projectApiKeys)"
                      />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col
                      xl="6"
                      class="text-center text-sm-left mt-3 mt-sm-3 mb-sm-3"
                    >
                      <div
                        v-if="projectKeys.length > 0"
                        v-html="parseMarkdown(namedSections.yourProjectKeys)"
                      />
                      <div
                        v-else
                        v-html="parseMarkdown(namedSections.noProjectKeys)"
                      />
                    </b-col>
                  </b-row>
                  <UserApiKeysTable
                    v-if="projectKeys.length > 0"
                    :api-keys="projectKeys"
                    :is-disabled="isDisabled"
                    type="project"
                    class="mb-3 mb-sm-5"
                    data-qa="project api keys table"
                    @keyDisabled="handleDisableApiKey"
                  />
                  <b-row>
                    <b-col
                      xl="6"
                      class="text-center text-sm-left mt-3 mt-sm-3 mb-sm-3"
                    >
                      <div
                        v-html="parseMarkdown(namedSections.newProjectKey)"
                      />
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <UserProjectApiKeyForm />
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
  import AlertMessage from '@/components/generic/AlertMessage';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import UserProjectApiKeyForm from '@/components/user/UserProjectApiKeyForm';
  import UserHeader from '@/components/user/UserHeader';
  import browseLandingStaticPageGraphql from '@/graphql/queries/browseLandingStaticPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';
  import camelCase from 'lodash/camelCase';
  import parseMarkdown from '@/utils/markdown/parse.js';

  export default {
    name: 'AccountAPIKeysPage',

    components: {
      AlertMessage,
      LoadingSpinner,
      UserApiKeysTable: () => import('@/components/user/UserApiKeysTable'),
      UserProjectApiKeyForm,
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
        projectKeys: [],
        showConfirmDangerModal: false,
        sections: []
      };
    },

    async fetch() {
      const apiKeys = await this.$apis.auth.getUserClients();

      this.personalKeys = apiKeys
        .filter((apiKey) => apiKey.type === 'PersonalKey');
      this.projectKeys = apiKeys
        .filter((apiKey) => apiKey.type === 'ProjectKey');
      try {
        const ctfEntry = await this.fetchContentfulEntry();
        this.sections = ctfEntry?.hasPartCollection?.items;
      } catch (e) {
        if (e.message === 'Not Found') {
          this.$error(404, { scope: 'page' });
        } else {
          throw (e);
        }
      }
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
      namedSections() {
        return this.sections.reduce((memo, section) => {
          if (section['__typename'] === 'ContentTypeRichText') {
            memo[camelCase(section.headlineEN)] = section.text;
          }
          return memo;
        }, {});
      }
    },

    methods: {
      async fetchContentfulEntry() {
        const variables = {
          identifier: '/account/api-keys',
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };
        const response = await this.$contentful.query(browseLandingStaticPageGraphql, variables);
        if (response?.data['staticPageCollection'].items[0]) {
          return response?.data['staticPageCollection']?.items[0];
        } else {
          throw new Error('Not Found');
        }
      },

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
      parseMarkdown
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .api-keys-page {
    .container {
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

      .icon-external-link {
        font-size: $font-size-extrasmall;

        @media (min-width: $bp-4k) {
          font-size: $font-size-extrasmall-4k;
        }
      }
    }
  }
</style>
