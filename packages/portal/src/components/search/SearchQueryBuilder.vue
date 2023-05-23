<template>
  <b-row
    class="search-query-builder py-3"
  >
    <b-col>
      <section
        :id="id"
        role="search"
      >
        <b-form
          @submit.prevent="searchWithBuiltQueries"
        >
          <transition-group
            name="fade"
          >
            <div
              v-for="(rule, index) in queryRules"
              :key="`${id}-${index}`"
              class="d-flex align-items-center flex-wrap flex-lg-nowrap"
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
          </transition-group>
          <b-button
            data-qa="search rules button"
            variant="primary"
            class="d-inline-flex align-items-center mr-3"
            type="submit"
          >
            {{ $t('search.advanced.actions.search') }}
          </b-button>
          <b-button
            data-qa="add rule button"
            variant="light"
            class="d-inline-flex align-items-center"
            @click="addNewRule"
          >
            {{ $t('search.advanced.actions.add') }}
          </b-button>
        </b-form>
      </section>
    </b-col>
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
          this.addNewRule();
        } else {
          this.$emit('show', true);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .search-query-builder {
    @media (min-width: $bp-large) {
      margin-top: -1rem;
      box-shadow: $boxshadow-small;
    }

    @media (min-width: $bp-xxxl) {
      margin-left: -4rem;
      margin-right: -4rem;

      .col {
        padding-left: 4rem;
        padding-right: 4rem;
      }
    }

    @media (min-width: $bp-4k) {
      margin-top: -1.5rem;
      padding-top: 1.5rem !important;
      padding-bottom: 1.5rem !important;
    }
  }
</style>
