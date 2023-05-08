<template>
  <!-- TODO: translate hardcoded texts -->
  <b-row>
    <div
      v-for="(rule, index) in queryRules"
      :key="index"
      class="d-flex align-items-center"
    >
      <SearchQueryBuilderRule
        :search-term="rule.searchTerm"
        :selected-field="rule.selectedField"
        :selected-modifier="rule.selectedModifier"
        @change="(field, value) => rule[field] = value"
      />
      <b-button @click="clearRule(index)">
        Clear
      </b-button>
    </div>
    <b-button @click="searchWithBuildQueries">
      Search
    </b-button>
    <b-button @click="addNewRule">
      Add
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

    data() {
      return {
        queryRules: [{}]
      };
    },

    computed: {
      currentURLQuery() {
        return this.$route.query.query;
      }
    },

    watch: {
      currentURLQuery(newVal) {
        this.$store.commit('search/setShowAdvancedSearch', !!newVal);
      }
    },

    mounted() {
      if (this.currentURLQuery) {
        this.$store.commit('search/setShowAdvancedSearch', true);
      }
    },

    methods: {
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        this.queryRules.splice(index, 1);
      },
      searchWithBuildQueries() {
        // Go to search results with created queries
      }
    }
  };
</script>
