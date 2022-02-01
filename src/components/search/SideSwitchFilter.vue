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
      {{ labelText }}
      <b-button
        v-if="$t(`facets.${name}.switchMoreInfo`) !== `facets.${name}.switchMoreInfo`"
        v-b-tooltip.hover.bottom
        :title="$t(`facets.${name}.switchMoreInfo`)"
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
       * I18n key for label text for the switch.
       *
       * If null, defaults to `facets.${name}.switch`
       */
      labelKey: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        localValue: this.value
      };
    },

    computed: {
      labelText() {
        const labelKey = this.labelKey || `facets.${this.name}.switch`;

        return this.$t(labelKey);
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
  Switch style checkbox:
  ```jsx
    <SideSwitchFilter
      value="metadata"
      name="api"
      checked-value="fulltext"
      unchecked-value="metadata"
    />
  ```
</docs>
