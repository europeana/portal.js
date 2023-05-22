<template>
  <b-row
    :id="id"
  >
    <div
      v-for="(rule, index) in queryRules"
      :key="index"
      class="d-flex align-items-center"
      :data-qa="`search query builder rule ${index}`"
    >
      <SearchQueryBuilderRule
        :id="`${id}-${index}`"
        :field="rule.field"
        :modifier="rule.modifier"
        :term="rule.term"
        @change="(field, value) => rule[field] = value"
      />
      <b-button
        :data-qa="`clear rule button ${index}`"
        @click="clearRule(index)"
      >
        {{ $t('search.advanced.actions.clear') }}
      </b-button>
    </div>
    <b-button
      data-qa="search rules button"
      @click="searchWithBuiltQueries"
    >
      {{ $t('search.advanced.actions.search') }}
    </b-button>
    <b-button
      data-qa="add rule button"
      @click="addNewRule"
    >
      {{ $t('search.advanced.actions.add') }}
    </b-button>
  </b-row>
</template>

<script>
  import SearchQueryBuilderRule from './SearchQueryBuilderRule.vue';

  const FIELD_TYPE_TEXT = 'text';
  const FIELD_TYPE_STRING = 'string';

  export default {
    name: 'SearchQueryBuilder',

    components: {
      SearchQueryBuilderRule
    },
    props: {
      id: {
        type: String,
        default: 'search-query-builder'
      }
    },

    data() {
      return {
        fields: [
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
        modifiers: [
          { name: 'contains', query: { text: '{field}:{term}', string: '{field}:*{term}*' } },
          { name: 'doesNotContain', query: { text: '!{field}:{term}', string: '!{field}:*{term}*' } }
        ],
        queryRules: []
      };
    },

    mounted() {
      this.initRulesFromRouteQuery();
      this.$emit('show', true);
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
      async searchWithBuiltQueries() {
        // TODO: evaluate where the routing happens. Could it go through the search interface.
        // TODO: Add matomo tracking event here?
        const qa = this.queryRules.map((rule) => {
          const field = this.fields.find((field) => field.name === rule.field);
          const modifier = this.modifiers.find((modifier) => modifier.name === rule.modifier);
          return modifier?.query[field.type].replace('{field}', field.name).replace('{term}', rule.term);
        }).filter((qa) => !!qa);
        const newRouteQuery = { ...this.$route.query, ...{ page: 1, qa } };
        const newRoute = { ...this.$route, query: newRouteQuery };
        await this.$router.push(newRoute);
      },
      initRulesFromRouteQuery() {
        this.queryRules = [].concat(this.$route.query.qa || []).map((qa) => {
          let modifier;
          if (qa.startsWith('!')) {
            modifier = 'doesNotContain';
            qa = qa.replace('!', '');
          } else {
            modifier = 'contains';
          }

          const qaParts = qa.split(':');
          const field = this.fields.find((field) => field.name === qaParts[0]);

          let term = qaParts[1] || '';
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
        if (this.queryRules.length === 0) {
          this.queryRules.push({});
        }
      }
    }
  };
</script>
