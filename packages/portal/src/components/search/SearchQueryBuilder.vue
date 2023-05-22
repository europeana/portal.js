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
        :disabled="disableClearRuleButton"
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

  export default {
    name: 'SearchQueryBuilder',

    components: {
      SearchQueryBuilderRule
    },
    props: {
      id: {
        type: String,
        default: 'search-query-builder'
      },
      rules: {
        type: Array,
        default: () => [{}]
      }
    },

    data() {
      return {
        queryRules: this.rules
      };
    },

    computed: {
      disableClearRuleButton() {
        return this.queryRules.length === 1;
      }
    },

    mounted() {
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
        const qa = this.queryRules.map((rule) => `${rule.field}:${rule.modifier}:${rule.term}`);
        const newRouteQuery = { ...this.$route.query, ...{ page: 1, qa } };
        const newRoute = { ...this.$route, query: newRouteQuery };
        await this.$router.push(newRoute);
      }
    }
  };
</script>
