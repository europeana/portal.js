<template>
  <div>
    <b-card
      v-for="(optionsValue, optionsKey) in options"
      :key="optionsKey"
      header="Type of media"
      class="mb-3"
      data-qa="search facets"
    >
      <b-form-checkbox-group
        v-model="selected"
        stacked
        plain
        :name="optionsKey"
      >
        <b-form-checkbox
          v-for="(value, key) in optionsValue"
          :key="key"
          :value="key"
        >
          {{ key }} ({{ value }})
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-card>
  </div>
</template>

<script>
  export default {
    props: {
      options: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        selected: []
      };
    },
    watch: {
      selected: function (selectedTypeValues) {
        console.log('selected', selectedTypeValues);
        this.$emit('changed', selectedTypeValues);
      }
    }
  };
</script>
