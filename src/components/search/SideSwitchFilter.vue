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
      {{ $t(`facets.${name}.switch`) }}
      <!-- @slot optional info icon with tooltip -->
      <slot />
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
  export default {
    name: 'SideSwitchFilter',

    props: {
      /**
       * Value to which the switch is set
       */
      value: {
        type: String,
        required: true
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
      }
    },

    data() {
      return {
        localValue: this.value
      };
    }
  };
</script>

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
