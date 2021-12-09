<template>
  <b-button
    :disabled="disabled"
    :style="style"
    :variant="variant"
    class="btn-collection w-100 text-left d-flex justify-content-between align-items-center"
    :data-qa="`toggle item button`"
    @click="$emit('toggle')"
  >
    <span>{{ displayField('title') }} ({{ set.visibility }}) - {{ $tc('items.itemCount', set.total || 0) }}</span>
    <span
      v-if="checked"
      class="icon-check-circle d-inline-flex"
    />
  </b-button>
</template>

<script>
  import { langMapValueForLocale } from '@/plugins/europeana/utils';

  export default {
    name: 'AddItemToSetButton',

    props: {
      set: {
        type: Object,
        required: true
      },
      img: {
        type: String,
        default: null
      },
      added: {
        type: Boolean,
        default: false
      },
      checked: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      style() {
        if (!this.added && this.img) {
          return { 'background-image': `url("${this.img}")` };
        }
        return null;
      },

      variant() {
        return this.added ? 'success' : 'overlay';
      }
    },

    methods: {
      displayField(field) {
        return langMapValueForLocale(this.set[field], this.$i18n.locale).values[0];
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .btn-collection {
    border: 0;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    padding: 1rem;
    position: relative;
    text-transform: none;

    span {
      position: relative;
      z-index: 10;

      &.icon-check-circle {
        font-size: $font-size-large;
      }
    }
  }
</style>
