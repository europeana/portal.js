<template>
  <div>
    <b-card
      :header="name"
      class="mb-3"
      data-qa="search facet"
    >
      <b-form-checkbox-group
        v-model="selected"
        stacked
        plain
        :name="name"
      >
        <b-form-checkbox
          v-for="(fieldCount, fieldValue) in fields"
          :key="fieldValue"
          :value="fieldValue"
        >
          {{ fieldValue }} ({{ fieldCount }})
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-card>
  </div>
</template>

<script>
  export default {
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
