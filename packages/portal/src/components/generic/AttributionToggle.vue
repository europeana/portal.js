<template>
  <figcaption
    ref="attributiontoggle"
    class="background-attribution"
    data-qa="attribution toggle"
    @mouseleave="toggleCite"
  >
    <b-button
      v-show="!showCite"
      ref="toggle"
      class="button-icon-only icon-info bg-transparent border-0"
      data-qa="toggle"
      :aria-label="$t('attribution.show')"
      @click="toggleCite"
      @mouseover="toggleCite"
      @touchstart="toggleCite"
    />
    <CiteAttribution
      v-if="showCite"
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
        showCite: false
      };
    },

    computed: {
      rightsStatement() {
        return this.attribution?.rightsStatement || this.attribution?.license;
      }
    },

    watch: {
      showCite(newVal) {
        if (newVal) {
          window.addEventListener('keydown', this.handleKeydown);
          window.addEventListener('focusin', this.handleFocusOutside);
        } else {
          window.removeEventListener('keydown', this.handleKeydown);
          window.removeEventListener('focusin', this.handleFocusOutside);
        }
      }
    },

    methods: {
      toggleCite() {
        this.showCite = !this.showCite;
      },
      handleKeydown(event) {
        if (event.key === 'Escape') {
          this.toggleCite();
          this.$nextTick(() => {
            this.$refs.toggle.focus();
          });
        }
      },
      handleFocusOutside(event) {
        const targetOutsideAttribution = this.checkIftargetOutsideAttribution(event);
        if (targetOutsideAttribution) {
          this.toggleCite();
        }
      },

      checkIftargetOutsideAttribution(event) {
        return this.$refs.attributiontoggle && !this.$refs.attributiontoggle.contains(event.target);
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
