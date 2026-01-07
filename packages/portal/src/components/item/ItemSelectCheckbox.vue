<template>
  <b-form-checkbox
    v-model="selected"
    class="item-select-checkbox position-absolute"
    :class="{
      active: selected,
      'mouse-enter': mouseenterClass
    }"
    @mouseenter.native="mouseenterClass = true"
    @mouseleave.native="mouseenterClass = false"
    @change.native="mouseenterClass = false"
  >
    <span
      class="m-3 position-relative d-inline-block"
      :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'"
    />
    <span class="visually-hidden">{{ selectCheckboxLabel }}</span>
  </b-form-checkbox>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';
  import { useSelectedItems } from '@/composables/selectedItems.js';
  import truncate from '@/utils/text/truncate.js';

  export default {
    name: 'ItemSelectCheckbox',

    props: {
      /**
       * Item identifier
       */
      identifier: {
        type: String,
        required: true
      },
      /**
       * Item title
       *
       * If an object is supplied, it is expected to be a LangMap.
       */
      title: {
        type: [String, Object],
        default: ''
      }
    },

    setup() {
      const { deselect, select, selected: selectedItems } = useSelectedItems();

      return { deselect, select, selectedItems };
    },

    data() {
      return {
        // Custom event handling and styles to revert icon only on mouse enter. Relying on hover to revert the select icon results in confusing UX (outlined icon on selection).
        mouseenterClass: false
      };
    },

    computed: {
      selected: {
        get() {
          return this.selectedItems.includes(this.identifier);
        },

        set(value) {
          if (value) {
            this.select(this.identifier);
          } else {
            this.deselect(this.identifier);
          }
        }
      },

      selectCheckboxLabel() {
        if (!this.title) {
          return null;
        } else if (typeof this.title === 'string') {
          return truncate(this.title, 90);
        } else {
          const langMapValue = langMapValueForLocale(this.title, this.$i18n.locale);
          return truncate(langMapValue.values[0], 90);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-checkbox {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    text-align: right;
    padding-left: 0;

    &.mouse-enter {
      .icon-select-circle:before {
        content: '\e96f';
      }
    }

    .custom-control-label {
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: $border-radius-small;
      font-size: $font-size-large;
      transition: opacity $standard-transition;
      cursor: pointer;

      &::before,
      &::after {
        content: none
      }

      [class*='icon-select-circle'] {
        color: $white;
        line-height: 1;
      }
    }

    .custom-control-label:hover,
    &.active .custom-control-label,
    input:focus-visible + .custom-control-label {
      opacity: 1;
      background-color: rgba(0, 0, 0, 40%);
      transition: opacity $standard-transition;
    }

    input:focus + .custom-control-label {
      outline: none;
    }

    input:focus-visible + .custom-control-label {
      outline: auto;
    }

    .custom-control-input {
      right: 1rem;
      left: auto;
      top: 1rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>
