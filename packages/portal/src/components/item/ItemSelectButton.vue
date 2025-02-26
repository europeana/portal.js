<template>
  <b-button
    v-if="$features.itemMultiSelect"
    v-b-tooltip.bottom
    :title="tooltipText"
    class="item-select-button"
    :pressed="selected"
    variant="light-flat"
    :aria-label="ariaLabelText"
    @click="toggle"
  >
    <span class="icon-check-circle" />
  </b-button>
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
      ariaLabelText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.selectItems');
      },
      tooltipText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.clickToSelectItems');
      }
    },

    methods: {
      toggle() {
        this.selected = !this.selected;
        this.$emit('select', this.selected);
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
  <ItemSelectButton />
  ```
</docs>
