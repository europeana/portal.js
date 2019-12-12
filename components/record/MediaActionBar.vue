<template>
  <section data-qa="action bar">
    <b-row>
      <b-col cols="6">
        <b-button
          v-if="url"
          :href="url | proxyMedia(europeanaIdentifier)"
          variant="outline-primary text-decoration-none"
          data-qa="download button"
          size="lg"
          class="mr-3"
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
        cols="6"
        class="d-flex align-items-center justify-content-end"
      >
        <small
          data-qa="provider name"
          class="is-display-4 view-at"
        >
          {{ isShownAt ? $t('actions.viewAt') : $t('actions.providedBy', { provider: providerName }) }}
          <SmartLink
            v-if="isShownAt"
            :destination="isShownAt"
          >{{ providerName }}</SmartLink>
        </small>
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
      rightsStatement: {
        type: String,
        default: null
      },
      providerName: {
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
        margin-left: 4px;
        display: inline-block
      }
    }
  }
</style>
