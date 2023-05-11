<template>
  <b-row>
    <div
      v-for="(rule, index) in queryRules"
      :key="index"
      class="d-flex align-items-center"
    >
      <SearchQueryBuilderRule
        :rule="rule"
        @change="(field, value) => rule[field] = value"
      />
      <b-button
        :disabled="disableClearRuleButton"
        @click="clearRule(index)"
      >
        {{ $t('search.advanced.actions.clear') }}
      </b-button>
    </div>
    <b-button @click="searchWithBuildQueries">
      {{ $t('search.advanced.actions.search') }}
    </b-button>
    <b-button @click="addNewRule">
      {{ $t('search.advanced.actions.add') }}
    </b-button>
  </b-row>
</template>

<script>
  import partition from 'lodash/partition';

  import SearchQueryBuilderRule from './SearchQueryBuilderRule.vue';
  export default {
    name: 'SearchQueryBuilder',

    components: {
      SearchQueryBuilderRule
    },

    data() {
      return {
        queryRules: [],
        // TODO: move fields and modifier definitions to plugin or mixin so they can be used for search pill display
        recognizedFields: [
          // TODO: allow the optional space after the field?
          // TODO: make field(s) an array to extend for example subject to cc_skos_prefLabel and cc_skos_altLabel
          // TODO: use field identifiers in regexs, in all casees here they could be automatically constructed
          // TODO: rename 'name' to identifier?
          { name: 'subject', regex: /^-?proxy_dc_subject:\s?/, type: 'text', field: 'proxy_dc_subject' },
          { name: 'title', regex: /^-?title:\s?/, type: 'text', field: 'title' },
          { name: 'description', regex: /^-?proxy_dc_description:\s?/, type: 'text', field: 'proxy_dc_description' },
          { name: 'creator', regex: /^-?CREATOR:\s?/, type: 'text', field: 'CREATOR' },
          { name: 'type', regex: /^-?proxy_dc_type:\s?/, type: 'text', field: 'proxy_dc_type' }
        ],
        recognizedTextModifiers: [
          { name: 'contains', regex: /^[^-].*:\s?\*(.*)\*$/, termPrefix: '*', termSuffix: '*' },
          { name: 'doesNotContain', regex: /^-.*:\s?\*(.*)\*$/, negatesField: true, termPrefix: '*', termSuffix: '*' },
          { name: 'is', regex: /^[^-].*:\s?"(.*)"$/, termPrefix: '"', termSuffix: '"'},
          { name: 'isNot', regex: /^-.*:\s?"(.*)"$/, negatesField: true, termPrefix: '"', termSuffix: '"' },
          { name: 'startsWith', regex: /^.*:\s?[^\*](.*)\*$/, termSuffix: '*' },
          { name: 'endsWith', regex: /^.*:\s?\*(.*)[^\*]$/, termPrefix: '"' }
        ]
      };
    },

    computed: {
      currentURLQuery() {
        return this.$route.query.query;
      },
      disableClearRuleButton() {
        return this.queryRules.length === 1;
      }
    },

    watch: {
      currentURLQuery: 'parseQueryRulesFromUrl'
    },

    mounted() {
      if (this.currentURLQuery) {
        this.parseQueryRulesFromUrl();
      }
    },

    methods: {
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        if (this.queryRules.length === 1 && index === 0) {
          this.queryRules = [{}];
        } else {
          this.queryRules.splice(index, 1);
        }
      },
      parseQueryRulesFromUrl() {
        // TODO: differentiate between any fields as NO field and unrecognized fields?
        const allParts = this.currentURLQuery.split(' AND ');
        const [recognizedFieldParts, nonRecognizedParts] = partition(allParts, (part) => {
          return this.recognizedFields.some((field) => part.match(field.regex));
        });
        const [recognizedParts, nonRecognizedModifiersParts] = partition(recognizedFieldParts, (part) => {
          // TODO: distinguish on field type. For now all are text
          return this.recognizedTextModifiers.some((modifier) => part.match(modifier.regex));
        });
        const allFieldQuery = nonRecognizedParts.join(' AND ');
        this.queryRules = recognizedParts.map((part) => this.ruleForQueryPart(part)).concat(allFieldQuery ? [{ selectedField: 'anyField', selectedModifier: 'is', searchTerm: allFieldQuery }] : []);
      },
      // TODO: this duplicates lookups that happen during parsing in the queryParts property.
      // instead of partioning then calling this, refactor to build rules objects straight away?
      ruleForQueryPart(rule) {
        const ruleObject = {};
        ruleObject.selectedField = this.recognizedFields.find((field) => rule.match(field.regex))?.name;
        const applicableModifier = this.recognizedTextModifiers.find((modifier) => {
          return rule.match(modifier.regex)
        });
        ruleObject.selectedModifier = applicableModifier.name;
        ruleObject.searchTerm = applicableModifier.regex.exec(rule)[1];

        return ruleObject;
      },
      queryPartFromRule(rule) {
        if (rule.selectedField === 'anyField') {
          return rule.searchTerm; //Any field is no field, a field may however be in the searchTerm itself
        }
        const activeModifier = this.recognizedTextModifiers.find((modifier) => modifier.name === rule.selectedModifier);
        const activeField = this.recognizedFields.find((field) => field.name === rule.selectedField);
        if (this.recognizedTextModifiers.find((modifier) => modifier.name === rule.selectedModifier).negatesField) {
          return `-${activeField.field}:${activeModifier.termPrefix}${rule.searchTerm}${activeModifier.termPrefix}`;
        }
        return `${activeField.field}:${activeModifier.termPrefix}${rule.searchTerm}${activeModifier.termPrefix}`;
      },
      queryFromRules() {
        return this.queryRules.map((rule) => this.queryPartFromRule(rule)).join(' AND ');
      },
      async searchWithBuildQueries() {
        // TODO: evaluate how to set this. Could it go through the search interface.
        // TOOD: Add matomo tracking event here?
        const query = this.queryFromRules();
        const baseQuery = this.$route.query;
        const newRouteQuery = { ...this.$route.query, ...{ page: 1, query } };
        const newRoute = { path: this.$route.path, query: newRouteQuery };
        await this.$router.push(newRoute);
      }
    }
  };
</script>
