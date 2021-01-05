<template>
  <div class="container hero-wrapper">
    <b-jumbotron
      :style="jumbotronStyle"
      fluid
      class="browse-jumbotron"
      data-qa="hero banner"
      @click="!citeCollapsed ? toggleCite : null"
    >
      <b-card>
        <h1>
          {{ title }}
        </h1>
        <b-card-text class="lead">
          {{ description }}
        </b-card-text>
        <call-to-action
          v-if="cta"
          :text="cta.text"
          :url="cta.url"
        />
      </b-card>
      <figcaption
        class="d-none d-md-block"
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
          :name="heroImage.name"
          :creator="heroImage.creator"
          :provider="heroImage.provider"
          :rights-statement="heroImage.license"
          :url="heroImage.url"
          extended
          data-qa="attribution"
        />
      </figcaption>
    </b-jumbotron>
  </div>
</template>

<script>
  import CallToAction from '../generic/CallToAction';
  import CiteAttribution from '../generic/CiteAttribution';

  export default {
    components: {
      CallToAction,
      CiteAttribution
    },
    props: {
      heroImage: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      cta: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        citeCollapsed: true
      };
    },
    computed: {
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.heroImage.image.url, this.heroImage.image.imageContentType, { width: 1920 });
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
