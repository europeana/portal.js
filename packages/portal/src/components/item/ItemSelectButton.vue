<template>
  <div>
    <b-button
      :id="buttonId"
      class="item-select-button p-0"
      :pressed="selected"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
      @mouseleave="showTooltip = false"
      @focusout="showTooltip = false"
      @focus="showTooltip = true"
      @mouseover="showTooltip = true"
    >
      <span
        :class="{
          'icon-select-circle': selected,
          'icon-select-circle-outlined': !selected
        }"
      />
    </b-button>
    <b-tooltip
      :id="tooltipId"
      placement="bottom"
      :show.sync="showTooltip"
      :target="buttonId"
      @show="(e) => { if (!showTooltip) { e.preventDefault() } } "
    >
      {{ tooltipText }}
    </b-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'ItemSelectButton',

    data() {
      return {
        buttonId: 'item-select-button',
        selected: false,
        showTooltip: false,
        tooltipId: 'item-select-button-tooltip'
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
        this.showTooltip = false; // Fix for touch devices that keep the tooltip open, overlaying the modal
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

  .btn-light-flat.item-select-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      @media (hover: hover) {
        .icon-select-circle:before {
          content: '\e96f';
        }
        .icon-select-circle-outlined:before {
          content: '\e96e';
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectButton />
  ```
</docs>
