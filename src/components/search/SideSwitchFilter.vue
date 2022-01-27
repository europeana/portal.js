<template>
  <b-form-group
    :label="$tFacetName(name)"
    label-class="facet-label"
  >
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
        default: 'checked'
      },

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
