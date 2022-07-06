<template>
  <figcaption
    class="background-attribution"
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
      :name="attribution ? attribution.name : null"
      :creator="attribution ? attribution.creator : null"
      :provider="attribution ? attribution.provider : null"
      :rights-statement="attribution ? attribution.license : null"
      :url="attribution ? attribution.url : null"
      extended
      data-qa="attribution"
    />
  </figcaption>
</template>

<script>
  import CiteAttribution from '@/components/generic/CiteAttribution';

  export default {
    name: 'AttributionToggle',

    components: {
      CiteAttribution
    },

    props: {
      attribution: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        citeCollapsed: true
      };
    },

    methods: {
      toggleCite() {
        this.citeCollapsed = !this.citeCollapsed;
      }
    }
  };
</script>
