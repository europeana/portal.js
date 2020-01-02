<template>
  <b-row>
    <b-col>
      <strong
        class="mb-4 d-inline-block"
      >
        {{ $t(`facets.${facetName}.name`) }}
      </strong>
      <b-form-radio-group
        v-model="selectedOption"
        class="option-group"
        :name="$tc(`facets.${facetName}.name`, 1)"
        plain
        @change="emitChange"
      >
        <b-form-radio
          v-for="(option, index) in options"
          :key="index"
          :value="option"
          name="api"
        >
          <FacetFieldLabel
            :facet-name="facetName"
            :field-value="option"
          />
        </b-form-radio>
      </b-form-radio-group>
    </b-col>
  </b-row>
</template>

<script>
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    name: 'FilterOptionsRadioGroup',

    components: {
      FacetFieldLabel
    },

    props: {
      facetName: {
        type: String,
        required: true
      },

      selected: {
        type: String,
        required: true
      },

      options: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        selectedOption: this.selected
      };
    },

    watch: {
      selected() {
        this.selectedOption = this.selected;
      }
    },

    methods: {
      emitChange() {
        this.$emit('change', this.selectedOption);
      }
    }
  };
</script>
