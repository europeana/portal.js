<template>
  <b-form-group
    :label="$t(`facets.${facetName}.name`)"
    :data-qa="`${facetName} filter`"
  >
    <b-row>
      <b-col>
        <b-form-radio-group
          v-model="selectedOption"
          :name="facetName"
          plain
          @change="emitChange"
        >
          <div
            class="option-group"
          >
            <b-form-radio
              v-for="(option, index) in options"
              :key="index"
              :value="option"
              :data-qa="`${option} radio`"
            >
              <FacetFieldLabel
                :facet-name="facetName"
                :field-value="option"
              />
            </b-form-radio>
          </div>
        </b-form-radio-group>
      </b-col>
    </b-row>
  </b-form-group>
</template>

<script>
  import FacetFieldLabel from './FacetFieldLabel';

  export default {
    name: 'RadioGroupFilter',

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
        this.$nextTick(() => {
          this.$emit('change', this.facetName, this.selectedOption);
        });
      }
    }
  };
</script>
