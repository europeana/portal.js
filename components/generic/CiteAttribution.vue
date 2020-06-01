<template>
  <cite>
    <p>Title:
      <SmartLink
        :destination="url"
      >
        {{ name }}
      </SmartLink>
    </p>
    <p>Creator:
      <SmartLink
        :destination="url"
      >
        {{ creator }}
      </SmartLink>
    </p>
    <!-- <p>Date:
      TODO: data currently not provided by api
      <span>{{ date }}</span>
    </p> -->
    <p>Institution:
      <span>{{ provider }}</span>
    </p>
    <!-- <p>Country:
      TODO: data currently not provided by api
      <span>{{ country }}</span>
    </p> -->
    <SmartLink
      :destination="rightsStatement"
      link-class="attribution"
    >
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
