<template>
  <b-dropdown
    :id="id"
    block
    class="search-query-builder-rule-dropdown search-filter-dropdown"
    :data-qa="`advanced search query builder: ${name} control`"
    no-flip
    :state="state"
    :text="displayText"
    :toggle-class="{
      'form-name': true,
      'is-invalid': state === false,
      'option-selected': value }"
  >
    <div
      v-for="(section, sectionIndex) in options"
      :key="`${name}-section-${sectionIndex}`"
    >
      <name
        :is="Array.isArray(section.options) && section.header ? 'b-dropdown-group' : 'div'"
        :header="section.header"
      >
        <b-dropdown-item-button
          v-for="(sectionOption, sectionOptionIndex) in [].concat(section.options)"
          :key="`${name}-section-${sectionIndex}-options-${sectionOptionIndex}`"
          :data-qa="`advanced search query builder: ${sectionOption.value} ${name} option`"
          button-class="d-flex"
          @click="handleClick(sectionOption.value)"
        >
          <span
            class="align-self-center"
          >
            {{ sectionOption.text }}
          </span>
          <b-button
            v-if="$te(`search.advanced.tooltip.${name}s.${sectionOption.value}`)"
            v-b-tooltip.bottom
            :title="$t(`search.advanced.tooltip.${name}s.${sectionOption.value}`)"
            class="icon-info-outline px-1 tooltip-button align-self-center"
            variant="light-flat"
          />
        </b-dropdown-item-button>
      </name>
      <b-dropdown-divider
        v-if="(sectionIndex + 1) < options.length"
      />
    </div>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'SearchQueryBuilderRuleDropdown',

    props: {
      /**
       * Id to set a unique value for each dropdown
       */
      id: {
        type: String,
        default: null
      },
      /**
       * Name of the dropdown
       */
      name: {
        type: String,
        required: true
      },
      /**
       * Options to display in the dropdpwn
       */
      options: {
        type: Array,
        required: true
      },
      /**
       * Validation state for submitting the dropdown value as part of the form
       */
      state: {
        type: Boolean,
        default: null
      },
      /**
       * v-model value
       */
      value: {
        type: String,
        default: null
      }
    },

    computed: {
      displayText() {
        return this.selectedOption?.text || this.$t(`search.advanced.placeholder.${this.name}`);
      },

      flattenedOptions() {
        return this.options.map((opt) => opt.options).flat();
      },

      selectedOption() {
        return this.flattenedOptions.find((opt) => opt.value === this.value);
      }
    },

    watch: {
      flattenedOptions: {
        deep: true,
        handler(newVal) {
          if (!newVal.find((opt) => opt.value === this.value)) {
            this.$emit('input', null);
            this.$emit('change', null);
          }
        }
      }
    },

    methods: {
      handleClick(value) {
        this.$emit('input', value);
        this.$emit('change', value);
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
    <SearchQueryBuilderRuleDropdown
      name="modifier"
      :options="[
        {
          options: [{
            value: 'contains',
            text: 'Contains'
          },{
            value: 'doesNotContain',
            text: 'Does not contain'
          }]
        }
      ]"
      text="Select a modifier"
    />
  ```
</docs>
