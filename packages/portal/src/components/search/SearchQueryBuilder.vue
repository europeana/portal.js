<template>
  <b-row
    :id="id"
  >
    <b-form
      @submit.prevent="searchWithBuiltQueries"
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
          @clear="clearRule(index)"
        />
      </div>
      <b-button
        data-qa="search rules button"
        type="submit"
      >
        {{ $t('search.advanced.actions.search') }}
      </b-button>
      <b-button
        data-qa="add rule button"
        @click="addNewRule"
      >
        {{ $t('search.advanced.actions.add') }}
      </b-button>
    </b-form>
  </b-row>
</template>

<script>
  import SearchQueryBuilderRule from './SearchQueryBuilderRule.vue';
  import advancedSearchMixin from '@/mixins/advancedSearch.js';

  export default {
    name: 'SearchQueryBuilder',

    components: {
      SearchQueryBuilderRule
    },

    mixins: [
      advancedSearchMixin
    ],

    props: {
      id: {
        type: String,
        default: 'search-query-builder'
      }
    },

    data() {
      return {
        queryRules: []
      };
    },

    mounted() {
      this.initRulesFromRouteQuery();
    },

    methods: {
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        if ((this.queryRules.length > 1) || (index > 0)) {
          this.queryRules.splice(index, 1);
        }
      },
      searchWithBuiltQueries() {
        // TODO: Add matomo tracking event here?
        this.$router.push(this.advancedSearchRouteQueryFromRules(this.queryRules));
      },
      initRulesFromRouteQuery() {
        this.queryRules = this.advancedSearchRulesFromRouteQuery();
        if (this.queryRules.length === 0) {
          this.queryRules.push({});
        } else {
          this.$emit('show', true);
        }
      }
    }
  };
</script>
