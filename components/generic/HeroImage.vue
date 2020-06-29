<template>
  <b-container
    v-if="compact"
    fluid
    class="hero-wrapper"
  >
    <h1>{{ header }}</h1>
    <p class="lead">
      {{ lead }}
    </p>
    <SocialShare
      :media-url="imageUrl"
    />
    <b-jumbotron
      :style="jumbotronStyle"
      fluid
      text-variant="white"
      data-qa="hero banner"
      class="mt-4"
      @click="toggleCite"
    >
      <figcaption
        @mouseleave="toggleCite"
      >
        <span
          v-if="citeCollapsed"
          class="icon-info"
          @click="toggleCite"
          @mouseover="toggleCite"
          @touchstart="toggleCite"
        />
        <CiteAttribution
          v-else
          :name="name"
          :creator="creator"
          :provider="provider"
          :rights-statement="rightsStatement"
          :url="url"
          extended
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
      compact: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        citeCollapsed: true
      };
    },
    computed: {
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType, { width: this.compact ? 820 : 1920 });
      },
      jumbotronStyle() {
        return {
          backgroundImage: `url("${this.optimisedImageUrl}")`
        };
      }
    },
    methods: {
      toggleCite() {
        this.citeCollapsed = !this.citeCollapsed;
      }
    }
  };
</script>
