<template>
  <b-form-group
    :label="$tFacetName(name)"
    label-class="facet-label"
  >
    <!--
    triggered on change
    @event changed
    @property {string} name - filter name
    @property {string} localValue - new value after switch
  -->
    <b-form-checkbox
      v-model="localValue"
      :name="name"
      switch
      :value="checkedValue"
      :unchecked-value="uncheckedValue"
      :data-qa="`${name} switch filter`"
      @change="$emit('changed', name, localValue)"
    >
      {{ label }}
      <b-button
        v-if="tooltip"
        v-b-tooltip.hover.bottom
        :title="tooltip"
        class="icon-info p-0 tooltip-button"
        variant="light-flat"
        data-qa="switch filter more info button"
      />
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
  import { VBTooltip } from 'bootstrap-vue';

  export default {
    name: 'SideSwitchFilter',

    directives: {
      'b-tooltip': VBTooltip
    },

    props: {
      /**
       * Value to which the switch is set
       */
      value: {
        type: String,
        default: null
      },

      /**
       * Name of filter
       */
      name: {
        type: String,
        required: true
      },

      /**
       * Value when switch is checked
       */
      checkedValue: {
        type: String,
        default: 'checked'
      },

      /**
       * Value when switch is unchecked
       */
      uncheckedValue: {
        type: String,
        default: 'unchecked'
      },

      /**
       * Value to consider default for the switch
       *
       * If the switch is set to its default value, it is not resettable.
       */
      defaultValue: {
        type: String,
        default: 'unchecked'
      },

      /**
       * Text for the switch label
       */
      label: {
        type: String,
        default: null
      },

      /**
       * Text for the switch tooltip
       */
      tooltip: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        localValue: this.value
      };
    },

    watch: {
      value() {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.$store.dispatch('search/setResettableFilter', {
          name: this.name,
          selected: (this.localValue === this.defaultValue) ? null : this.localValue
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .btn.tooltip-button {
    color: $grey;
    font-size: $font-size-base;
  }
</style>

<docs lang="md">
  Switch-style checkbox with tooltip:
  ```jsx
    <SideSwitchFilter
      value="metadata"
      name="api"
      checked-value="fulltext"
      unchecked-value="metadata"
      label="Search only in the content of items with full-text"
      tooltip="More info!"
    />
  ```
</docs>
