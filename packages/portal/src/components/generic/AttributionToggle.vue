<template>
  <figcaption
    class="background-attribution"
    @mouseleave="toggleCite"
  >
    <b-button
      v-if="citeCollapsed"
      class="button-icon-only icon-info bg-transparent border-0"
      @click="toggleCite"
      @mouseover="toggleCite"
      @touchstart="toggleCite"
    />
    <CiteAttribution
      v-else
      :name="attribution ? attribution.name : null"
      :creator="attribution ? attribution.creator : null"
      :provider="attribution ? attribution.provider : null"
      :rights-statement="rightsStatement"
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

    computed: {
      rightsStatement() {
        return this.attribution?.rightsStatement || this.attribution?.license;
      }
    },

    watch: {
      citeCollapsed(newVal) {
        if (newVal) {
          window.removeEventListener('keydown', this.handleKeydown);
        } else {
          window.addEventListener('keydown', this.handleKeydown);
        }
      }
    },

    // TODO: Focus first focusable element when cite opened by keyboard, trap focus? Add close button for keyboard only?
    methods: {
      toggleCite() {
        this.citeCollapsed = !this.citeCollapsed;
      },
      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.citeCollapsed = true;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .btn-secondary.button-icon-only {
    &:focus {
      background: transparent;
      color: $white;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px; height: 200px; position: relative;">
      <AttributionToggle
        :attribution="{
          name: 'Something',
          creator: 'Someone who made this',
          provider: 'Somewhere',
          license: 'http://creativecommons.org/licenses/by-nd/4.0/',
          url: 'http://www.example.org/'
        }"
      />
      </div>
  ```
</docs>
