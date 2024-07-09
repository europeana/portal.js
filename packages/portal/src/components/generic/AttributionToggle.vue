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
      :aria-expanded="showCite"
      class="button-icon-only icon-info bg-transparent border-0"
      data-qa="toggle"
      :aria-label="$t('attribution.show')"
      @click="toggleCite"
      @mouseover="toggleCite"
      @touchstart="toggleCite"
      @keydown="keyboardNav = true"
    />
    <CiteAttribution
      v-if="showCite"
      :name="attribution ? attribution.name : null"
      :creator="attribution ? attribution.creator : null"
      :provider="attribution ? attribution.provider : null"
      :rights-statement="rightsStatement"
      :url="attribution ? attribution.url : null"
      :set-focus="keyboardNav"
      extended
      data-qa="attribution"
      @keydown.escape.native="handleCiteAttributionKeydownEscape"
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
        keyboardNav: false,
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
          window.addEventListener('focusin', this.handleWindowFocusin);
        } else {
          window.removeEventListener('focusin', this.handleWindowFocusin);
        }
      }
    },

    beforeDestroy() {
      window.removeEventListener('focusin', this.handleWindowFocusin);
    },

    methods: {
      toggleCite() {
        this.showCite = !this.showCite;
      },
      handleCiteAttributionKeydownEscape() {
        this.resetKeyboardNav();
        this.toggleCite();
        this.$nextTick(() => {
          this.$refs.toggle.focus();
        });
      },
      handleWindowFocusin(event) {
        // focus has changed, toggle the citation if not to a child element
        !this.$refs.attributiontoggle?.contains(event.target) && this.toggleCite() && this.resetKeyboardNav();
      },
      resetKeyboardNav() {
        this.keyboardNav = false;
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
