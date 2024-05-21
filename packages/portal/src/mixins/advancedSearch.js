import camelCase from 'lodash/camelCase';
import escapeRegExp from 'lodash/escapeRegExp';
import { escapeLuceneSpecials, unescapeLuceneSpecials } from '@europeana/utils';

export const FIELD_TYPE_FULLTEXT = 'fulltext';
const FIELD_TYPE_STRING = 'string';
const FIELD_TYPE_TEXT = 'text';
const FIELD_TYPES = [FIELD_TYPE_FULLTEXT, FIELD_TYPE_STRING, FIELD_TYPE_TEXT];

const FIELD_SUGGEST_AGENT = 'agent';
const FIELD_SUGGEST_TIMESPAN = 'timespan';
const FIELD_SUGGEST_CONCEPT = 'concept';
const FIELD_SUGGEST_PLACE = 'place';

const advancedSearchFields = [
  { name: 'fulltext', type: FIELD_TYPE_FULLTEXT },
  { name: 'proxy_dc_contributor', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT },
  { name: 'proxy_dc_coverage', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_PLACE },
  { name: 'proxy_dc_creator', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT },
  { name: 'proxy_dc_date', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_dc_description', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_format', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dc_identifier', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_publisher', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_rights', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_source', type: FIELD_TYPE_STRING },
  { name: 'proxy_dc_subject', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dc_title', type: FIELD_TYPE_TEXT },
  { name: 'proxy_dc_type', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dcterms_alternative', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_created', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_dcterms_hasPart', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_isPartOf', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_issued', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_medium', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT },
  { name: 'proxy_dcterms_provenance', type: FIELD_TYPE_STRING },
  { name: 'proxy_dcterms_spatial', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_PLACE },
  { name: 'proxy_dcterms_temporal', type: FIELD_TYPE_STRING, suggestEntityType: FIELD_SUGGEST_TIMESPAN },
  { name: 'proxy_edm_currentLocation', type: FIELD_TYPE_STRING },
  { name: 'proxy_edm_hasMet', type: FIELD_TYPE_STRING },
  { name: 'proxy_edm_isRelatedTo', type: FIELD_TYPE_STRING },
  { name: 'what', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_CONCEPT, aggregated: true },
  { name: 'when', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_TIMESPAN, aggregated: true },
  { name: 'where', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_PLACE, aggregated: true },
  { name: 'who', type: FIELD_TYPE_TEXT, suggestEntityType: FIELD_SUGGEST_AGENT, aggregated: true },
  { name: 'YEAR', type: FIELD_TYPE_STRING }
];

const advancedSearchFieldsForEntityLookUp = advancedSearchFields
  .filter((field) => field.suggestEntityType && !field.aggregated);

const advancedSearchFieldNames = advancedSearchFields.map((field) => field.name);

const advancedSearchModifiers = [
  {
    name: 'exact',
    query: {
      [FIELD_TYPE_FULLTEXT]: '<field>:"<term>"'
    }
  },
  {
    name: 'contains',
    query: {
      [FIELD_TYPE_FULLTEXT]: '<field>:(<term>)',
      [FIELD_TYPE_STRING]: '<field>:<term>',
      [FIELD_TYPE_TEXT]: '<field>:<term>'
    }
  },
  {
    name: 'doesNotContain',
    query: {
      [FIELD_TYPE_FULLTEXT]: 'NOT <field>:(<term>)',
      [FIELD_TYPE_STRING]: '-<field>:<term>',
      [FIELD_TYPE_TEXT]: '-<field>:<term>'
    }
  }
];
for (const mod of advancedSearchModifiers) {
  mod.patterns = {};
  for (const fieldType in mod.query) {
    const pattern = escapeRegExp(mod.query[fieldType])
      .replace('<field>', '(?<field>[^ ]+?)')
      .replace('<term>', '(?<term>.+?)');
    mod.patterns[fieldType] = new RegExp(`^${pattern}$`);
  }
}

const advancedSearchModifiersForAllFields = advancedSearchModifiers
  .filter((mod) => FIELD_TYPES.every((type) => !!mod.query[type]));

export default {
  data() {
    return {
      advancedSearchFields,
      advancedSearchFieldsForEntityLookUp,
      advancedSearchFieldNames,
      advancedSearchModifiers,
      advancedSearchModifiersForAllFields,
      advancedSearchRouteQueryKey: 'qa'
    };
  },

  computed: {
    advancedSearchRouteQuery() {
      return this.$route.query[this.advancedSearchRouteQueryKey];
    }
  },

  methods: {
    advancedSearchModifiersForField(name) {
      const field = this.advancedSearchFieldByName(name);
      return advancedSearchModifiers.filter((mod) => !!mod.query[field?.type]);
    },

    advancedSearchFieldByName(name) {
      return this.advancedSearchFields.find((field) => field.name === name);
    },

    advancedSearchFieldLabel(fieldName, locale) {
      const fieldKey = fieldName === 'YEAR' ? 'year' : camelCase(fieldName.replace('proxy_', ''));
      return this.$t(`fieldLabels.default.${fieldKey}`, locale);
    },

    advancedSearchQueryFromRule(rule, escaped) {
      const field = this.advancedSearchFieldByName(rule.field);
      const modifier = this.advancedSearchModifiers.find((modifier) => modifier.name === rule.modifier);
      const escapedTerm = escapeLuceneSpecials(rule.term, { spaces: true });
      const term = escaped ? escapedTerm : rule.term;
      return modifier?.query[field.type].replace('<field>', field.name).replace('<term>', term);
    },

    advancedSearchRouteQueryFromRules(rules) {
      const qa = rules.map((rule) => this.advancedSearchQueryFromRule(rule, true))
        .filter((qa) => !!qa);

      const newRouteQuery = { ...this.$route.query, ...{ page: 1 } };

      if (qa.length) {
        newRouteQuery[this.advancedSearchRouteQueryKey] = qa;
      } else {
        delete newRouteQuery[this.advancedSearchRouteQueryKey];
      }

      return { ...this.$route, query: newRouteQuery };
    },

    advancedSearchRuleIsValid(rule) {
      return this.advancedSearchRuleValidationsPass(this.advancedSearchRuleValidations(rule));
    },

    advancedSearchRuleValidationsPass(validations) {
      return Object.values(validations).every((validation) => validation.state);
    },

    // If any rule control has a value, all are required. If none have a value, the
    // rule will be ignored and none are required.
    advancedSearchRuleValidations(rule) {
      const validations = {};

      const noRuleControlHasValue = !Object.values(rule).some((value) => !!value);
      for (const control in rule) {
        if (noRuleControlHasValue || rule[control]) {
          validations[control] = { state: true };
        } else {
          validations[control] = { state: false, text: this.$t('statuses.required') };
        }
      }

      return validations;
    },

    advancedSearchRulesFromRouteQuery(routeQuery) {
      return [].concat(routeQuery || this.advancedSearchRouteQuery || []).map((qa) => {
        for (const modifier of this.advancedSearchModifiers) {
          for (const fieldType in modifier.patterns) {
            const pattern = modifier.patterns[fieldType];
            const match = qa.match(pattern);
            const field = advancedSearchFields.find((f) => f.name === match?.groups?.field);
            if (match?.groups && field) {
              return {
                field: field.name,
                modifier: modifier.name,
                term: unescapeLuceneSpecials(match.groups.term, { spaces: true })
              };
            }
          }
        }
        return null;
      }).filter((rule) => !!rule);
    }
  }
};
