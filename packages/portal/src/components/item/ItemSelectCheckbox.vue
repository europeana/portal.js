<template>
  <b-form-checkbox
    v-model="selected"
    class="item-select-checkbox"
    :class="{ active: selected }"
    @change="toggleItemSelection"
  >
    <span
      class="card-overlay d-inline-block"
      :class="selected ? 'icon-select-circle' : 'icon-select-circle-outlined'"
    />
    <slot />
  </b-form-checkbox>
</template>

<script>
  export default {
    name: 'ItemSelectCheckbox',

    props: {
      /**
       * Item identifier
       */
      identifier: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        selected: false
      };
    },

    methods: {
      toggleItemSelection(value) {
        if (value) {
          this.$store.commit('set/selectItem', this.identifier);
        } else {
          this.$store.commit('set/deselectItem', this.identifier);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-checkbox {
    padding-left: 0;
    position: static;
    min-height: 0;

    .custom-control-label {
      position: static;

      .card-overlay {
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
        text-align: right;
        transition: opacity $standard-transition;
        z-index: 2;
        cursor: pointer;

        &:before {
          display: inline-block;
          margin: 1rem;
        }
      }

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
      .card-overlay {
        opacity: 1;
        background-color: rgba(0, 0, 0, 40%);
        transition: opacity $standard-transition;
      }
    }

    input:focus + .custom-control-label {
      outline: none;
    }

    input:focus-visible + .custom-control-label .card-overlay {
      outline: auto;
    }

    .custom-control-input {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
