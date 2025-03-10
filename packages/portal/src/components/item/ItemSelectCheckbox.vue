<template>
  <b-form-checkbox
    v-model="selected"
    class="item-select-checkbox position-absolute"
    :class="{ active: selected }"
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

    computed: {
      selected: {
        get() {
          return this.$store.state.set.selectedItems.includes(this.identifier);
        },

        set(value) {
          if (value) {
            this.$store.commit('set/selectItem', this.identifier);
          } else {
            this.$store.commit('set/deselectItem', this.identifier);
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

      &:hover {
        .icon-select-circle:before {
          content: '\e96f';
        }
        .icon-select-circle-outlined:before {
          content: '\e96e';
        }
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
