<template>
  <b-card
    header="Type of media"
    class="mb-3"
    data-qa="search facets"
  >
    <b-form-checkbox-group
      v-model="selectedType"
      stacked
      plain
      name="type-facet"
    >
      <b-form-checkbox
        v-for="(value, key) in optionsType"
        :key="key"
        :value="key"
      >
        {{ key }} ({{ value }})
      </b-form-checkbox>
    </b-form-checkbox-group>
  </b-card>
</template>

<script>
  export default {
    props: {
      optionsType: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        selectedType: []
      };
    },
    watch: {
      selectedType: function (selectedTypeValues) {
        this.$emit('changed', selectedTypeValues);
      }
    }
  };
</script>
