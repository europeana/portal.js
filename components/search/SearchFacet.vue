<template>
  <div>
    <b-card
      :header="name | renameHeader"
      class="mb-3"
      data-qa="search facet"
    >
      <b-form-checkbox-group
        v-model="selected"
        :name="name"
        stacked
        plain
      >
        <b-form-checkbox
          v-for="(fieldCount, fieldValue) in fields"
          :key="fieldValue"
          :value="fieldValue"
        >
          {{ fieldValue }} ({{ fieldCount | localise }})
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
      name: {
        type: String,
        default: ''
      },
      fields: {
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
      selected: function (selectedFieldValues) {
        this.selected = selectedFieldValues;
        this.$emit('changed', this.name, selectedFieldValues);
      }
    }
  };
</script>
