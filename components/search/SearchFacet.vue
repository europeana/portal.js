<template>
  <div>
    <b-card
      :data-facet-name="name"
      :header="name | searchFacetHeader"
      class="mb-3"
      data-qa="search facet"
    >
      <b-form-checkbox-group
        v-model="selected"
        :name="name"
        stacked
        plain
        @change="changeSelected"
      >
        <b-form-checkbox
          v-for="field in fields"
          :key="field.label"
          :value="field.label"
        >
          {{ field.label }} ({{ field.count | localise }})
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
        type: Array,
        default: () => []
      },
      selectedFields: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      selected: {
        get: function () {
          return this.preserved ? this.preserved : this.selectedFields;
        },
        set: function (values) {
          this.preserved = values;
        }
      }
    },
    methods: {
      changeSelected: function(values) {
        this.$emit('changed', this.name, values);
      }
    }
  };
</script>
