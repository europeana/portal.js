<template>
  <b-form-group
    :label="$tFacetName(name)"
  >
    <b-form-checkbox
      :name="name"
      v-model="localValue"
      switch
      :value="checkedValue"
      :unchecked-value="uncheckedValue"
      :data-qa="`${name} switch filter`"
      @change="$emit('changed', name, localValue)"
    >
      {{ $t(`facets.${name}.switch`) }}
      <slot />
    </b-form-checkbox>
  </b-form-group>
</template>

<script>
  export default {
    name: 'SideSwitchFilter',

    props: {
      value: {
        type: String,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      checkedValue: {
        type: String,
        default: 'true'
      },

      uncheckedValue: {
        type: String,
        default: false
      }
    },

    data() {
      return {
        localValue: this.value
      };
    }
  };
</script>
