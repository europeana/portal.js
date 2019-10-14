<template>
  <b-jumbotron
    :header="headline"
    :lead="description"
    :style="jumbotronStyle"
    fluid
    header-tag="h2"
    header-level="4"
    text-variant="white"
    data-qa="hero banner"
  >
    <SmartLink
      :destination="attributionLinkDestination"
      link-class="attribution"
    >
      {{ attributionLinkText }}
      <RightsStatement
        :rights-statement-url="rightsStatement"
      />
    </SmartLink>
  </b-jumbotron>
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
      headline: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      imageContentType: {
        type: String,
        default: null
      },
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
        default: ''
      },
      url: {
        type: String,
        default: ''
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
      attributionLinkDestination() {
        if (this.recordIdentifier) {
          return { name: 'record-all', params: { pathMatch: this.recordIdentifier.slice(1) } };
        }
        return this.url;
      },
      attributionLinkText() {
        if (this.citation !== '') return this.citation;
        return [this.name, this.creator, this.provider].filter(Boolean).join(', ');
      },
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType);
      },
      jumbotronStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
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
