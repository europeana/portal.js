<template>
  <b-input-group
    data-qa="search query builder rule"
  >
    <b-form-group
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
        :value="field"
        :options="selectFieldOptions"
        required
        @input="(value) => handleFieldInput(value)"
      />
    </b-form-group>
    <b-form-group
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
        :value="modifier"
        :options="selectModifierOptions"
        required
        @input="(value) => handleModifierInput(value)"
      />
    </b-form-group>
    <b-form-group
      :label="$t('search.advanced.input.searchTerm')"
      :label-for="`search-term-${id}`"
    >
      <b-form-input
        :id="`search-term-${id}`"
        :value="term"
        required
        @input="(value) => handleTermInput(value)"
      />
    </b-form-group>
  </b-input-group>
</template>

<script>
  import { BFormSelect, BTooltip } from 'bootstrap-vue';
  import camelCase from 'lodash/camelCase';

  export default {
    name: 'SearchQueryBuilderRule',

    components: {
      BFormSelect,
      BTooltip
    },
    props: {
      field: {
        type: String,
        default: null
      },
      modifier: {
        type: String,
        default: null
      },
      term: {
        type: String,
        default: null
      },
      id: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        fields: [
          'proxy_dc_contributor',
          'proxy_dc_coverage',
          'proxy_dc_creator',
          'proxy_dc_date',
          'proxy_dc_description',
          'proxy_dc_format',
          'proxy_dc_identifier',
          'proxy_dc_publisher',
          'proxy_dc_rights',
          'proxy_dc_source',
          'proxy_dc_subject',
          'proxy_dc_title',
          'proxy_dc_type',
          'proxy_dcterms_alternative',
          'proxy_dcterms_created',
          'proxy_dcterms_hasPart',
          'proxy_dcterms_isPartOf',
          'proxy_dcterms_issued',
          'proxy_dcterms_medium',
          'proxy_dcterms_provenance',
          'proxy_dcterms_spatial',
          'proxy_dcterms_temporal',
          'proxy_edm_currentLocation',
          'proxy_edm_hasMet',
          'proxy_edm_isRelatedTo',
          'YEAR'
        ],
        modifiers: [
          'contains',
          'doesNotContain'
        ]
      };
    },
    computed: {
      selectFieldOptions() {
        return this.fields.map((field) => ({
          value: field,
          text: this.$i18n.t(`fieldLabels.default.${field === 'YEAR' ? 'year' : camelCase(field.replace('proxy_', ''))}`)
        }))
          .sort((a, b) => a.text.localeCompare(b.text));
      },
      selectModifierOptions() {
        return this.modifiers.map((mod) => ({
          value: mod,
          text: this.$i18n.t(`search.advanced.modifiers.${mod}`)
        }));
      }
    },
    methods: {
      handleTermInput(value) {
        this.$emit('change', 'term', value);
      },
      handleFieldInput(value) {
        this.$emit('change', 'field', value);
      },
      handleModifierInput(value) {
        this.$emit('change', 'modifier', value);
      }
    }
  };
</script>
