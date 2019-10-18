<template>
  <cite>
    <SmartLink
      :destination="linkDestination"
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
        required: true
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
      // TODO: remove in future when url always supplied
      identifier: {
        type: String,
        default: ''
      },
      // TODO: remove in future when split fields (name/creator/provider) always supplied
      citation: {
        type: String,
        default: ''
      }
    },
    computed: {
      linkDestination() {
        if (this.recordIdentifier) {
          return { name: 'record-all', params: { pathMatch: this.recordIdentifier.slice(1) } };
        }
        return this.url;
      },
      linkText() {
        if (this.citation !== '') return this.citation;
        return [this.name, this.creator, this.provider].filter(Boolean).join(', ');
      },
      recordIdentifier() {
        const itemUriPattern = /^http:\/\/data\.europeana\.eu\/item(\/.*)$/;
        if (this.identifier !== '') {
          return this.identifier;
        } else if (itemUriPattern.test(this.url)) {
          return this.url.match(itemUriPattern)[1];
        }
        return null;
      }
    }
  };
</script>
