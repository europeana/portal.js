<template>
  <b-input-group
    data-qa="search query builder rule"
    class="query-rule"
  >
    <b-form-group
      class="query-rule-form-group"
      :label-for="`select-field-${id}`"
    >
      <template #label>
        <span :id="`select-field-label-${id}`">
          {{ $t('search.advanced.input.field') }}
        </span>
      </template>
      <b-tooltip
        :target="`select-field-label-${id}`"
        :title="$t('search.advanced.tooltip.field')"
        boundary-padding="0"
        placement="bottom"
      />
      <b-form-select
        :id="`select-field-${id}`"
        :value="selectedField"
        :options="searchFields"
        @input="(value) => $emit('change', 'selectedField', value)"
      />
    </b-form-group>
    <b-form-group
      class="query-rule-form-group"
      :label-for="`select-modifier-${id}`"
    >
      <template #label>
        <span :id="`select-modifier-label-${id}`">
          {{ $t('search.advanced.input.modifier') }}
        </span>
      </template>
      <b-tooltip
        :target="`select-modifier-label-${id}`"
        :title="$t('search.advanced.tooltip.modifier')"
        boundary-padding="0"
        placement="bottom"
      />
      <b-form-select
        :id="`select-modifier-${id}`"
        :value="selectedModifier"
        :options="modifiers"
        @input="(value) => $emit('change', 'selectedModifier', value)"
      />
    </b-form-group>
    <b-form-group
      class="query-rule-form-group"
      :label="$t('search.advanced.input.searchTerm')"
      :label-for="`search-term-${id}`"
    >
      <b-form-input
        :id="`search-term-${id}`"
        :value="searchTerm"
        @input="(value) => $emit('change', 'searchTerm', value)"
      />
    </b-form-group>
  </b-input-group>
</template>

<script>
  import { BFormSelect, BTooltip } from 'bootstrap-vue';
  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      BFormSelect,
      BTooltip
    },
    props: {
      searchTerm: {
        type: String,
        default: null
      },
      selectedField: {
        type: String,
        default: null
      },
      selectedModifier: {
        type: String,
        default: null
      },
      searchFields: {
        type: Array,
        default: () => []
      },
      modifiers: {
        type: Array,
        default: () => []
      },
      id: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .query-rule {
    max-width: $max-text-column-width;

    @media (min-width: $bp-wqhd) {
      max-width: 50%;
    }
  }

  .query-rule-form-group {
    flex-basis: 100%;

    @media (min-width: $bp-large) {
      flex-basis: 33%;
    }
  }
</style>
