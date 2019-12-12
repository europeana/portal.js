<template>
  <section
    data-qa="action bar"
    class="d-flex align-items-center"
  >
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
    <small
      data-qa="provider name"
      class="ml-auto is-display-4 view-at"
    >
      {{ isShownAt ? $t('actions.viewAt') : $t('actions.providedBy', { provider: providerName }) }}
      <SmartLink
        v-if="isShownAt"
        :destination="isShownAt"
      >
        {{ providerName }}
      </SmartLink>
    </small>
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
      position: relative;
      padding-right: 1.2rem;

      &:after {
        content: '\e900';
        @extend .icon-font;
        position: absolute;
        right: 0;
        top: 3px;
      }
    }
  }
</style>
