<template>
  <b-container
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
      class="mt-4"
      data-qa="image"
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
          :name="attribution.name"
          :creator="attribution.creator"
          :provider="attribution.provider"
          :rights-statement="rightsStatement"
          :url="attribution.url"
          extended
          data-qa="attribution"
        />
      </figcaption>
    </b-jumbotron>
  </b-container>
</template>

<script>
  export default {
    name: 'ImageWithAttribution',

    components: {
      CiteAttribution: () => import('./CiteAttribution'),
      SocialShare: () => import('./SocialShare')
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
      name: {
        type: String,
        default: null
      },
      imageContentType: {
        type: String,
        default: null
      },
      attribution: {
        type: Object,
        required: true
      },
      rightsStatement: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        citeCollapsed: true
      };
    },
    computed: {
      optimisedImageUrl() {
        return this.$options.filters.optimisedImageUrl(this.imageUrl, this.imageContentType, { width: 820 });
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
