<template>
  <div>
    <b-button
      class="search-multilingual-button p-0 mr-2"
      :pressed="multilingualSearchEnabled"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
    >
      <span
        :class="{
          'icon-translate': multilingualSearchEnabled,
          'icon-translate-outlined': !multilingualSearchEnabled
        }"
      />
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'SearchMultilingualButton',

    props: {
      multilingualState: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        multilingualSearchEnabled: this.multilingualState
      };
    },

    computed: {
      ariaLabelText() {
        return this.multilingualSearchEnabled ? this.$t('search.multilingual.disable') : this.$t('search.multilingual.enable');
      }
    },

    watch: {
      multilingualState(newVal) {
        this.multilingualSearchEnabled = newVal;
      }
    },

    methods: {
      toggle() {
        if (this.$auth.loggedIn) {
          this.multilingualSearchEnabled = !this.multilingualSearchEnabled;
          this.$emit('toggleMultilingual', this.multilingualSearchEnabled);
          this.$cookies?.set('multilingualSearch', this.multilingualSearchEnabled);
        } else {
          this.$keycloak.login();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .search-multilingual-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      .icon-translate:before {
        content: '\e93c';
      }
      .icon-translate-outlined:before {
        content: '\e970';
      }
    }
  }

</style>
