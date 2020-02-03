<template>
  <section data-qa="action bar">
    <b-row>
      <b-col
        cols="12"
        lg="6"
        class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center mb-3 mb-lg-0"
      >
        <b-button
          v-if="url"
          :href="downloadUrl"
          variant="outline-primary text-decoration-none"
          data-qa="download button"
          size="lg"
          class="mr-3"
          :target="!useProxy ? '_blank' : '_self'"
        >
          {{ $t('actions.download') }}
        </b-button>

        <SmartLink
          v-if="rightsStatementIsUrl"
          :destination="rightsStatement"
          class="attribution"
          data-qa="rights statement"
        >
          <RightsStatement
            :rights-statement-url="rightsStatement"
          />
        </SmartLink>
        <span
          v-else
          data-qa="rights statement"
        >
          {{ rightsStatement }}
        </span>
      </b-col>
      <b-col
        cols="12"
        lg="6"
        class="d-flex align-items-center justify-content-lg-end is-size-4 view-at"
      >
        <i18n
          v-if="isShownAt"
          path="actions.viewAt"
          tag="p"
          data-qa="provider name"
          class="mb-0 text-lg-right"
        >
          <template v-slot:link>
            <!-- eslint-disable vue/multiline-html-element-content-newline -->
            <SmartLink
              :destination="isShownAt"
              :lang="dataProviderLang"
            >{{ dataProviderName }}</SmartLink>
            <!-- eslint-enable vue/multiline-html-element-content-newline -->
          </template>
        </i18n>
        <i18n
          v-else
          class="mb-0 text-lg-right"
          data-qa="provider name"
          path="actions.providedBy"
          tag="p"
        >
          <template v-slot:provider>
            <span :lang="dataProviderLang">
              {{ dataProviderName }}
            </span>
          </template>
        </i18n>
      </b-col>
    </b-row>
  </section>
</template>

<script>
  import RightsStatement from '../../components/generic/RightsStatement';
  import SmartLink from '../../components/generic/SmartLink';

  export default {
    name: 'MediaActionBar',

    components: {
      RightsStatement,
      SmartLink
    },

    props: {
      url: {
        type: String,
        default: null
      },
      europeanaIdentifier: {
        type: String,
        required: true
      },
      useProxy: {
        type: Boolean,
        required: true
      },
      rightsStatement: {
        type: String,
        default: null
      },
      dataProviderName: {
        type: String,
        default: null
      },
      dataProviderLang: {
        type: String,
        default: null
      },
      isShownAt: {
        type: String,
        default: null
      }
    },

    computed: {
      rightsStatementIsUrl() {
        return RegExp('^https?://*').test(this.rightsStatement);
      },

      downloadUrl() {
        return this.useProxy ? this.$options.filters.proxyMedia(this.url, this.europeanaIdentifier) : this.url;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/icons.scss';

  .view-at {
    .is-external-link {
      &:after {
        content: '\e900';
        @extend .icon-font;
        margin-left: 0.25rem;
        display: inline-block;
      }
    }
  }
</style>
