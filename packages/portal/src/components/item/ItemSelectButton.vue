<template>
  <b-button
    v-b-tooltip.bottom
    :title="tooltipText"
    class="item-select-button p-0"
    :pressed="selected"
    variant="light-flat"
    :aria-label="ariaLabelText"
    @click="toggle"
    @mouseleave="hideTooltips"
  >
    <span :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'" />
  </b-button>
</template>

<script>
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemSelectButton',

    setup() {
      const { hideTooltips } = useHideTooltips();
      return { hideTooltips };
    },

    data() {
      return {
        selected: false
      };
    },

    computed: {
      ariaLabelText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.selectItems');
      },
      tooltipText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.clickToSelectItems');
      }
    },

    watch: {
      selected(newVal) {
        if (newVal) {
          window.addEventListener('keyup', this.handleKeyup);
        } else {
          window.removeEventListener('keyup', this.handleKeyup);
          this.$store.commit('set/setSelected', []);
        }
      }
    },

    methods: {
      handleKeyup(event) {
        if (event.key === 'Escape') {
          this.toggle();
        }
      },
      toggle() {
        if (this.$auth.loggedIn) {
          this.selected = !this.selected;
          this.$emit('select', this.selected);
        } else {
          this.$keycloak.login();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      .icon-select-circle:before {
        content: '\e96f';
      }
      .icon-select-circle-outlined:before {
        content: '\e96e';
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectButton />
  ```
</docs>
