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
          data-qa="search query builder form"
          @submit.prevent="updateSearch"
        >
          <transition-group
            name="fade"
          >
            <div
              v-for="(rule, index) in queryRules"
              :key="`${id}-${index}`"
              :data-qa="`search query builder rule ${index}`"
            >
              <SearchQueryBuilderRule
                :id="`${id}-${index}`"
                v-model="queryRules[index]"
                :tooltips="index === 0"
                :validations="validations[index]"
                @change="(field, value) => handleChangeRule(field, value, index)"
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
            <span class="icon-search pr-1" />
            {{ $t('actions.apply') }}
          </b-button>
          <b-button
            data-qa="add rule button"
            variant="light"
            class="d-inline-flex align-items-center"
            @click="addNewRule"
          >
            <span class="icon-ic-add pr-1" />
            {{ $t('actions.add') }}
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
        queryRules: [],
        validations: []
      };
    },

    computed: {
      validQueryRules() {
        return this.queryRules.filter((rule) => rule.field && rule.modifier && rule.term);
      }
    },

    watch: {
      '$route.query.qa': 'initRulesFromRouteQuery'
    },

    created() {
      this.initRulesFromRouteQuery();
    },

    methods: {
      handleChangeRule(field, value, index) {
        this.queryRules[index][field] = value;
      },
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        this.queryRules.splice(index, 1);
        if (this.queryRules.length === 0) {
          this.addNewRule();
        }
      },
      updateSearch() {
        if (!this.validateQueryRules()) {
          return;
        }
        if (this.$matomo) {
          for (const rule of this.validQueryRules) {
            const fieldLabel = this.advancedSearchFieldLabel(rule.field, 'en');
            const modifierLabel = this.$t(`search.advanced.modifiers.${rule.modifier}`, 'en');
            const eventName = `Adv search: ${fieldLabel} ${modifierLabel}`;
            this.$matomo.trackEvent('Adv search', 'Apply adv search', eventName);
          }
        }
        this.$router.push(this.advancedSearchRouteQueryFromRules(this.validQueryRules));
      },
      initRulesFromRouteQuery() {
        this.queryRules = this.advancedSearchRulesFromRouteQuery();
        if (this.queryRules.length === 0) {
          this.addNewRule();
        } else {
          this.$emit('show', true);
        }
      },
      validateQueryRules() {
        let valid = true;

        this.validations = this.queryRules.map((rule) => {
          const ruleValidation = {};

          // If any field has a value, all are required. If none have a value, the
          // rule will be ignored and none are required.
          if ([rule.term, rule.field, rule.modifier].some((value) => !!value)) {
            for (const key of ['term', 'field', 'modifier']) {
              if (!rule[key] || (rule[key] === '')) {
                ruleValidation[key] = this.$t('set.form.required');
                valid = false;
              }
            }
          }
          return ruleValidation;
        });

        return valid;
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
