<template>
  <cite>
    <SmartLink
      :destination="url"
      link-class="attribution"
    >
      {{ linkText }}
      <RightsStatement
        v-if="rightsStatement"
        :rights-statement-url="rightsStatement"
      />
    </SmartLink>
  </cite>
</template>

<script>
  import RightsStatement from '../../components/generic/RightsStatement';
  import SmartLink from '../../components/generic/SmartLink';

  export default {
    components: {
      RightsStatement,
      SmartLink
    },

    props: {
      name: {
        type: String,
        default: null
      },
      creator: {
        type: String,
        default: null
      },
      provider: {
        type: String,
        default: null
      },
      rightsStatement: {
        type: String,
        required: true
      },
      url: {
        type: String,
        default: null
      }
    },

    computed: {
      linkText() {
        return [this.name, this.creator, this.provider].filter(Boolean).join(', ');
      }
    }
  };
</script>
