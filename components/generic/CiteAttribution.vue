<template>
  <cite v-if="extended">
    <p v-if="name !== null">{{ $t('exhibitions.attribution.title') }}
      <SmartLink
        :destination="url"
      >
        {{ name }}
      </SmartLink>
    </p>
    <p v-if="creator !== null">{{ $t('exhibitions.attribution.creator') }}
      <SmartLink
        :destination="url"
      >
        {{ creator }}
      </SmartLink>
    </p>
    <!-- <dt>{{ $t('exhibitions.attribution.date') }}</dt>
    <p>
      TODO: data currently not provided by api
      <span>{{ date }}</span>
    </p> -->
    <p v-if="provider !== null">{{ $t('exhibitions.attribution.institution') }}
      <SmartLink
        :destination="url"
      >
        {{ provider }}
      </SmartLink>
    </p>
    <!-- <dt>{{ $t('exhibitions.attribution.country') }}</dt>
    <p>
      TODO: data currently not provided by api
      <span>{{ country }}</span>
    </p> -->
    <p>
      <SmartLink
        :destination="rightsStatement"
        link-class="attribution"
      >
        <RightsStatement
          v-if="rightsStatement"
          :rights-statement-url="rightsStatement"
        />
      </SmartLink>
    </p>
  </cite>
  <cite v-else>
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
      },
      extended: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      linkText() {
        return [this.name, this.creator, this.provider].filter(Boolean).join(', ');
      }
    }
  };
</script>
