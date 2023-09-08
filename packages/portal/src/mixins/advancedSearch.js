import camelCase from 'lodash/camelCase';
import escapeRegExp from 'lodash/escapeRegExp';
import { escapeLuceneSpecials, unescapeLuceneSpecials } from '@/plugins/europeana/utils.js';
import { FIELD_TYPE_FULLTEXT, FIELD_TYPE_STRING, FIELD_TYPE_TEXT, advancedSearchFields } from '@/plugins/europeana/advancedSearchFields';

const advancedSearchFieldNames = advancedSearchFields.map((field) => field.name);

const advancedSearchModifiers = [
  {
    name: 'contains',
    query: {
      [FIELD_TYPE_FULLTEXT]: '<field>:(<term>)',
      [FIELD_TYPE_STRING]: '<field>:*<term>*',
      [FIELD_TYPE_TEXT]: '<field>:<term>'
    }
  },
  {
    name: 'doesNotContain',
    query: {
      [FIELD_TYPE_FULLTEXT]: 'NOT <field>:(<term>)',
      [FIELD_TYPE_STRING]: '-<field>:*<term>*',
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

export default {
  data() {
    return {
      advancedSearchFields,
      advancedSearchFieldNames,
      advancedSearchModifiers,
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
        const escapedTerm = escapeLuceneSpecials(rule.term, { spaces: true });
        return modifier?.query[field.type].replace('<field>', field.name).replace('<term>', escapedTerm);
      }).filter((qa) => !!qa);

      const newRouteQuery = { ...this.$route.query, ...{ page: 1, [this.advancedSearchRouteQueryKey]: qa } };

      return { ...this.$route, query: newRouteQuery };
    },

    advancedSearchRulesFromRouteQuery() {
      return [].concat(this.advancedSearchRouteQuery || []).map((qa) => {
        for (const modifier of this.advancedSearchModifiers) {
          for (const fieldType in modifier.patterns) {
            const pattern = modifier.patterns[fieldType];
            const match = qa.match(pattern);
            if (match?.groups && this.advancedSearchFieldNames.includes(match.groups.field)) {
              return {
                field: match.groups.field,
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
