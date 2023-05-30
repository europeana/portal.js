import camelCase from 'lodash/camelCase';

const FIELD_TYPE_TEXT = 'text';
const FIELD_TYPE_STRING = 'string';

export default {
  data() {
    return {
      advancedSearchFields: [
        { name: 'proxy_dc_contributor', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_coverage', type: FIELD_TYPE_STRING },
        { name: 'proxy_dc_creator', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_date', type: FIELD_TYPE_STRING },
        { name: 'proxy_dc_description', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_format', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_identifier', type: FIELD_TYPE_STRING },
        { name: 'proxy_dc_publisher', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_rights', type: FIELD_TYPE_STRING },
        { name: 'proxy_dc_source', type: FIELD_TYPE_STRING },
        { name: 'proxy_dc_subject', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_title', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dc_type', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_alternative', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_created', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_hasPart', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_isPartOf', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_issued', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_medium', type: FIELD_TYPE_TEXT },
        { name: 'proxy_dcterms_provenance', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_spatial', type: FIELD_TYPE_STRING },
        { name: 'proxy_dcterms_temporal', type: FIELD_TYPE_STRING },
        { name: 'proxy_edm_currentLocation', type: FIELD_TYPE_STRING },
        { name: 'proxy_edm_hasMet', type: FIELD_TYPE_STRING },
        { name: 'proxy_edm_isRelatedTo', type: FIELD_TYPE_STRING },
        { name: 'YEAR', type: FIELD_TYPE_STRING }
      ],
      advancedSearchModifiers: [
        { name: 'contains', query: { text: '{field}:{term}', string: '{field}:*{term}*' } },
        { name: 'doesNotContain', query: { text: '-{field}:{term}', string: '-{field}:*{term}*' } }
      ],
      advancedSearchRouteQueryKey: 'qa'
    };
  },

  computed: {
    advancedSearchRouteQuery() {
      return this.$route.query[this.advancedSearchRouteQueryKey];
    }
  },

  methods: {
    advancedSearchFieldLabel(fieldName, locale) {
      const fieldKey = fieldName === 'YEAR' ? 'year' : camelCase(fieldName.replace('proxy_', ''));
      return this.$t(`fieldLabels.default.${fieldKey}`, locale);
    },

    advancedSearchRouteQueryFromRules(rules) {
      const qa = rules.map((rule) => {
        const field = this.advancedSearchFields.find((field) => field.name === rule.field);
        const modifier = this.advancedSearchModifiers.find((modifier) => modifier.name === rule.modifier);
        return modifier?.query[field.type].replace('{field}', field.name).replace('{term}', rule.term);
      }).filter((qa) => !!qa);

      const newRouteQuery = { ...this.$route.query, ...{ page: 1, [this.advancedSearchRouteQueryKey]: qa } };

      return { ...this.$route, query: newRouteQuery };
    },

    advancedSearchRulesFromRouteQuery() {
      return [].concat(this.advancedSearchRouteQuery || []).map((qa) => {
        let modifier;
        if (qa.startsWith('-')) {
          modifier = 'doesNotContain';
          qa = qa.replace('-', '');
        } else {
          modifier = 'contains';
        }

        const qaParts = qa.split(':');
        const field = this.advancedSearchFields.find((field) => field.name === qaParts[0]);

        let term = (qaParts.slice(1) || []).join(':');
        if (field?.type === 'string') {
          if (term.startsWith('*')) {
            term = term.slice(1);
          }
          if (term.endsWith('*')) {
            term = term.slice(0, term.length - 1);
          }
        }

        if (field && modifier) {
          return {
            field: field.name,
            modifier,
            term
          };
        }
        return null;
      })
        .filter((rule) => !!rule);
    }
  }
};
