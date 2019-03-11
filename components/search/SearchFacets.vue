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
        v-for="option in optionsType"
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
    props: {
      optionsType: {
        type: Array,
        default: () => [{ text: 'Image', value: 'image', count: '210000' },
                        { text: 'Video', value: 'video', count: '210' },
                        { text: 'Audio', value: 'audio', count: '5' },
                        { text: 'PDF', value: 'pdf', count: '0' }]
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
