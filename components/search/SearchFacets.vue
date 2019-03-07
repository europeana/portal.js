<template>
  <b-card header="Type of media">
    <b-card-text>
      <b-form-checkbox-group
        v-model="selected"
        stacked
        plain
        name="type-facet"
        :options="options"
      />
    </b-card-text>
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
    }
  };
</script>
