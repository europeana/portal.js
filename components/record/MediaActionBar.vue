<template>
  <section
    data-qa="action bar"
    class="d-flex align-items-center"
  >
    <b-button
      v-if="url"
      :href="url | proxyMedia(europeanaIdentifier)"
      variant="outline-primary primary"
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
      }
    },

    computed: {
      rightsStatementIsUrl() {
        return RegExp('^https?://*').test(this.rightsStatement);
      }
    }
  };
</script>
