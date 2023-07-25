<template>
  <b-dropdown
    block
    class="search-query-builder-rule-dropdown search-filter-dropdown"
    :data-qa="`advanced search query builder: ${name} control`"
    no-flip
    :state="state"
    :text="text"
    :toggle-class="{ 'form-name': true, 'is-invalid': state === false }"
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
          @click="$emit('change', sectionOption.value)"
        >
          {{ sectionOption.text }}
          <b-button
            v-if="$te(`search.advanced.tooltip.${name}s.${sectionOption.value}`)"
            v-b-tooltip.bottom
            :title="$t(`search.advanced.tooltip.${name}s.${sectionOption.value}`)"
            class="icon-info-outline p-0 tooltip-button"
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
      name: {
        type: String,
        required: true
      },

      options: {
        type: Array,
        required: true
      },

      state: {
        type: Boolean,
        default: null
      },

      text: {
        type: String,
        default: null
      }
    }
  };
</script>
