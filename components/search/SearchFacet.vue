<template>
  <div>
    <b-card
      :data-facet-name="name"
      :header="$t(`facets.${name}.name`)"
      class="mb-3"
      data-qa="search facet"
    >
      <b-form-radio-group
        v-if="type === 'radio'"
        v-model="selected"
        :name="name"
        stacked
        plain
        @change="changeSelected"
      >
        <b-form-radio
          v-for="field in fields"
          :key="field === 'all' ? '' : field"
          :value="field === 'all' ? '' : field"
        >
          {{ $t(`facets.${name}.options.${field}`) }}
        </b-form-radio>
      </b-form-radio-group>
      <b-form-checkbox-group
        v-else
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
      type: {
        type: String,
        default: 'checkbox'
      },
      fields: {
        type: Array,
        default: () => []
      },
      selectedFields: {
        type: [Array, String],
        default: ''
      }
    },
    computed: {
      selected: {
        get() {
          return this.preserved ? this.preserved : this.selectedFields;
        },
        set(values) {
          this.preserved = values;
        }
      }
    },
    methods: {
      changeSelected(values) {
        this.$emit('changed', this.name, values);
      }
    }
  };
</script>
