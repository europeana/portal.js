<template>
  <b-jumbotron
    :header="header"
    :lead="lead"
    :style="jumbotronStyle"
    fluid
    header-tag="h2"
    header-level="4"
    text-variant="white"
    data-qa="hero banner"
  >
    <CiteAttribution
      :citation="citation"
      :identifier="identifier"
      :name="name"
      :creator="creator"
      :provider="provider"
      :rights-statement="rightsStatement"
      :url="url"
    />
  </b-jumbotron>
</template>

<script>
  import CiteAttribution from '../../components/generic/CiteAttribution';

  export default {
    components: {
      CiteAttribution
    },
    props: {
      header: {
        type: String,
        default: ''
      },
      lead: {
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
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType);
      },
      jumbotronStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      }
    }
  };
</script>
