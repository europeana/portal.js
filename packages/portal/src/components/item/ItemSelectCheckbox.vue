<template>
  <b-form-checkbox
    v-model="selected"
    :checked="selected"
    :aria-label="selectCheckboxLabel"
    class="item-select-checkbox position-absolute"
    button
    button-variant="light-flat"
  >
    <span :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'" />
  </b-form-checkbox>
</template>

<script>
  import { langMapValueForLocale } from '@europeana/i18n';
  import truncate from '@/utils/text/truncate.js';

  export default {
    name: 'ItemSelectCheckbox',

    props: {
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

    data() {
      return {
        selected: false
      };
    },

    computed: {
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

    .btn-light-flat {
      background-color: transparent;
      font-size: $font-size-large;
      line-height: 1;
      padding: 0;
      display: inline-flex;
      margin: 1rem;
    }

    label {
      opacity: 0;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: $border-radius-small;
      }

      &.active,
      &.focus,
      &:hover {
        opacity: 1;

        &::before {
          background-color: rgba(0, 0, 0, 40%);
        }
      }

      &:hover {
        .icon-select-circle:before {
          content: '\e96f';
        }
        .icon-select-circle-outlined:before {
          content: '\e96e';
        }
      }

      [class^='icon-select-circle'] {
        color: $white;
        position: relative;
        line-height: 1;
      }
    }
  }
</style>
