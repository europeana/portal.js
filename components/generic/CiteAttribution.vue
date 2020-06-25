<template>
  <cite v-if="extended">
    <dl class="europeana-attribution">
      <dt>{{ $t('exhibitions.attribution.title') }}</dt>
      <dd>
        <SmartLink
          :destination="url"
        >
          {{ name }}
        </SmartLink>
      </dd>
      <dt>{{ $t('exhibitions.attribution.creator') }}</dt>
      <dd>
        <SmartLink
          :destination="url"
        >
          {{ creator }}
        </SmartLink>
      </dd>
      <!-- <dt>{{ $t('exhibitions.attribution.date') }}</dt>
      <dd>
        TODO: data currently not provided by api
        <span>{{ date }}</span>
      </dd> -->
      <dt>{{ $t('exhibitions.attribution.institution') }}</dt>
      <dd>
        <SmartLink
          :destination="url"
        >
          {{ provider }}
        </SmartLink>
      </dd>
      <!-- <dt>{{ $t('exhibitions.attribution.country') }}</dt>
      <dd>
        TODO: data currently not provided by api
        <span>{{ country }}</span>
      </dd> -->
      <dd>
        <SmartLink
          :destination="rightsStatement"
          link-class="attribution"
        >
          <RightsStatement
            v-if="rightsStatement"
            :rights-statement-url="rightsStatement"
          />
        </SmartLink>
      </dd>
    </dl>
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
