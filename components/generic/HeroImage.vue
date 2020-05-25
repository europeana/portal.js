<template>
  <b-container
    v-if="exhibition"
    fluid
  >
    <h1>{{ header }}</h1>
    <p class="lead">{{ lead }}</p>
    <SocialShare
      :media-url="imageUrl"
    />
    <b-jumbotron
      :style="jumbotronStyle"
      fluid
      text-variant="white"
      data-qa="hero banner"
    >
      <figcaption>
        <CiteAttribution
          :name="name"
          :creator="creator"
          :provider="provider"
          :rights-statement="rightsStatement"
          :url="url"
        />
      </figcaption>
    </b-jumbotron>
  </b-container>
  <b-jumbotron
    v-else
    :header="header"
    :lead="lead"
    :style="jumbotronStyle"
    fluid
    header-tag="h1"
    header-level="4"
    text-variant="white"
    data-qa="hero banner"
  >
    <figcaption>
      <CiteAttribution
        :name="name"
        :creator="creator"
        :provider="provider"
        :rights-statement="rightsStatement"
        :url="url"
      />
    </figcaption>
  </b-jumbotron>
</template>

<script>
  import CiteAttribution from '../../components/generic/CiteAttribution';
  import SocialShare from '../../components/generic/SocialShare';

  export default {
    components: {
      CiteAttribution,
      SocialShare
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
      exhibition: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType, { width: 1920 });
      },
      jumbotronStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      }
    }
  };
</script>
