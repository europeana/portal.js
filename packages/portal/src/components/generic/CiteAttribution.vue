<template>
  <cite
    v-if="extended"
    class="cite-attribution"
  >
    <p v-if="name">{{ $t('attribution.title') }}
      <SmartLink
        v-if="url"
        :destination="url"
      >
        {{ name }}
      </SmartLink>
      <span v-else>
        {{ name }}
      </span>
    </p>
    <p v-if="creator">{{ $t('attribution.creator') }}
      <SmartLink
        v-if="url"
        :destination="url"
      >
        {{ creator }}
      </SmartLink>
      <span v-else>
        {{ creator }}
      </span>
    </p>
    <p v-if="provider">{{ $t('attribution.institution') }}
      <SmartLink
        v-if="url"
        :destination="url"
      >
        {{ provider }}
      </SmartLink>
      <span v-else>
        {{ provider }}
      </span>
    </p>
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

  /**
   * Attribution for a cited resource
   */
  export default {
    name: 'CiteAttribution',

    components: {
      RightsStatement,
      SmartLink
    },

    props: {
      /**
       * Name of the cited resource
       */
      name: {
        type: String,
        default: null
      },
      /**
       * Creator of the cited resource
       */
      creator: {
        type: String,
        default: null
      },
      /**
       * Provider of the cited resource
       */
      provider: {
        type: String,
        default: null
      },
      /**
       * Rights statement URL of the cited resource
       */
      rightsStatement: {
        type: String,
        required: true
      },
      /**
       * URL of the cited resource
       */
      url: {
        type: String,
        default: null
      },
      /**
       * If `true`, use the extended format
       */
      extended: {
        type: Boolean,
        default: false
      },
      /**
       * If `true`, focus the first link when mounted
       */
      setFocus: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      linkText() {
        return [this.name, this.creator, this.provider].filter(Boolean).join(', ');
      }
    },

    mounted() {
      if (this.extended && this.setFocus) {
        this.$el.getElementsByTagName('a')[0]?.focus();
      }
    }
  };
</script>

<docs lang="md">
  Default format:
  ```jsx
  <CiteAttribution
    name="Default format attribution"
    creator="Europeana Foundation"
    provider="Europeana"
    url="https://www.europeana.eu/"
    rights-statement="http://creativecommons.org/publicdomain/zero/1.0/"
  />
  ```

  Extended format:
  ```jsx
  <CiteAttribution
    name="Extended format attribution"
    creator="Europeana Foundation"
    provider="Europeana"
    url="https://www.europeana.eu/"
    rights-statement="http://creativecommons.org/publicdomain/zero/1.0/"
    :extended="true"
  />
  ```
</docs>
