<template>
  <b-card header="Type of media">
    <b-form-checkbox-group
      v-model="selected"
      stacked
      plain
      name="type-facet"
    >
      <b-form-checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }} ({{ option.count }})
      </b-form-checkbox>
    </b-form-checkbox-group>
  </b-card>
</template>

<script>
  export default {
    data() {
      return {
        selected: [],
        options: [
          { text: 'Image', value: 'image', count: '210000' },
          { text: 'Video', value: 'video', count: '210' },
          { text: 'Audio', value: 'audio', count: '5' },
          { text: 'PDF', value: 'pdf', count: '0' }
        ]
      };
    },
    watch: {
      selected: function (selectedValues) {
        this.$emit('changed', selectedValues);
      }
    }
  };
</script>
