<template>
  <div>
    <b-card
      v-for="(optionsValue, optionsKey) in options"
      :key="optionsKey"
      :header="optionsKey | renameHeader"
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
          {{ key }} ({{ value | localise }})
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-card>
  </div>
</template>

<script>
  const headerText = { 'TYPE': 'Type of media' };

  export default {
    filters: {
      renameHeader: function (value) {
        return headerText[value] || value;
      }
    },
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
      selected: function (selectedValues) {
        this.$emit('changed', selectedValues);
      }
    }
  };
</script>
