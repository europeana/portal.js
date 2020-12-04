<template>
  <div class="container hero-wrapper">
    <b-jumbotron
      :style="jumbotronStyle"
      fluid
      class="browse-jumbotron"
      text-variant="white"
      data-qa="hero banner"
      @click="toggleCite"
    >
      <b-card>
        <h1>
          {{ header }}
        </h1>
        <b-card-text class="lead">
          {{ lead }}
        </b-card-text>
        <SmartLink
          :destination="url"
          class="btn btn-primary"
        >
          {{ $t('galleries.explore') }}
        </SmartLink>
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
          :name="name"
          :creator="creator"
          :provider="provider"
          :rights-statement="rightsStatement"
          extended
          data-qa="attribution"
        />
      </figcaption>
    </b-jumbotron>
  </div>
</template>

<script>
  import CiteAttribution from '../../components/generic/CiteAttribution';
  import SmartLink from '../../components/generic/SmartLink';

  export default {
    components: {
      CiteAttribution,
      SmartLink
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
      }
    },
    data() {
      return {
        citeCollapsed: true
      };
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
    },
    methods: {
      toggleCite() {
        this.citeCollapsed = !this.citeCollapsed;
      }
    }
  };
</script>
