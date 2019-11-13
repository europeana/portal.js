<template>
  <section
    data-qa="action bar"
    class="d-flex align-items-center"
  >
    <b-button
      :href="url | proxyMedia(europeanaIdentifier)"
      variant="outline-primary primary"
      data-qa="download button"
      size="lg"
      class="mr-3"
    >
      {{ $t('actions.download') }}
    </b-button>

    <SmartLink
      v-if="rightsStatementUrl"
      :destination="rightsStatementUrl"
      class="attribution"
    >
      <RightsStatement
        :rights-statement-url="rightsStatementUrl"
      />
    </SmartLink>
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
        required: true
      },
      europeanaIdentifier: {
        type: String,
        required: true
      },
      rightsStatementUrl: {
        type: String,
        default: null
      }
    }
  };
</script>
