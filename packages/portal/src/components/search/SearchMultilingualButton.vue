<template>
  <div v-if="$features.multilingualSearch">
    <b-button
      class="search-multilingual-button p-0 mr-2"
      :pressed="selected"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
    >
      <span
        :class="{
          'icon-translate': selected,
          'icon-translate-outlined': !selected
        }"
      />
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'SearchMultilingualButton',

    data() {
      return {
        selected: false
      };
    },

    computed: {
      ariaLabelText() {
        return this.selected ? this.$t('search.multilingual.disable') : this.$t('search.multilingual.enable');
      }
    },

    methods: {
      toggle() {
        if (this.$auth.loggedIn) {
          this.selected = !this.selected;
          // TODO: enable multilingual search
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
