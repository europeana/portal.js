<template>
  <div class="item-select-button user-buttons">
    <b-button
      v-b-tooltip.bottom
      data-qa="item select button"
      class="select-button text-uppercase d-inline-flex align-items-center"
      :pressed="selected"
      variant="outline-light"
      :aria-label="buttonText"
      @click="toggle"
    >
      {{ buttonText }}
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'ItemSelectButton',

    data() {
      return {
        selected: false
      };
    },

    computed: {
      buttonText() {
        return this.selected ? this.$t('actions.deselect') : this.$t('actions.select');
      }
    },

    methods: {
      toggle() {
        this.selected = !this.selected;
      }
    }
  };
</script>

<style lang="scss">
  .content-card:not(.list-card) {
    .user-buttons {
      &.item-select-button {
        top: auto;
        bottom: 0.5rem;
      }
    }
  }
</style>

<docs>
  ```jsx
  <ItemSelectButton />
  ```
</docs>
