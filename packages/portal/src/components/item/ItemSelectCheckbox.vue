<template>
  <b-form-checkbox
    v-model="selected"
    :checked="selected"
    :aria-label="selectCheckboxLabel"
    class="item-select-checkbox position-absolute"
  />
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
  .item-select-checkbox {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    label {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
</style>
