<template>
  <b-container
    fluid
    class="search-query-builder py-3"
  >
    <b-container>
      <b-row>
        <b-col>
          <section
            :id="id"
            role="search"
          >
            <b-form
              data-qa="search query builder form"
              autocomplete="off"
              @submit.prevent="handleSubmitForm"
            >
              <transition-group
                name="fade"
              >
                <div
                  v-for="(rule, index) in queryRules"
                  :key="`${id}-rule-${index}`"
                  :data-qa="`search query builder rule ${index}`"
                >
                  <SearchQueryBuilderRule
                    :id="`${id}-rule-${index}`"
                    ref="rule"
                    v-model="queryRules[index]"
                    :tabindex="index === 0 && 0"
                    :tooltips="index === 0"
                    :validation="validations[index]"
                    @change="handleRuleChange"
                    @clear="clearRule(index)"
                  />
                </div>
              </transition-group>
              <div class="d-inline-flex d-lg-block flex-column align-items-start">
                <b-button
                  data-qa="advanced search query builder: add rule button"
                  variant="light"
                  class="d-inline-flex align-items-baseline mb-4 mb-lg-0 order-first"
                  @click="addNewRule"
                >
                  <span class="icon-add pr-2" />
                  {{ $t('actions.add') }}
                  <span class="visually-hidden">{{ $t('search.advanced.newRule') }}</span>
                </b-button>
              </div>
              <input
                type="submit"
                hidden
              >
            </b-form>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
  import SearchQueryBuilderRule from './SearchQueryBuilderRule';
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
      /**
       * Id to set a unique value
       */
      id: {
        type: String,
        default: 'search-query-builder'
      },
      /**
       * Whether the component is shown
       */
      show: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        queryRules: [],
        validations: []
      };
    },

    computed: {
      nonEmptyQueryRules() {
        return this.queryRules.filter((rule) => Object.values(rule).every((value) => !!value));
      }
    },

    watch: {
      '$route.query.qa': 'initRulesFromRouteQuery',
      show(newVal) {
        if (newVal) {
          this.$refs.rule[0].$el.focus();
        }
      }
    },

    created() {
      this.initRulesFromRouteQuery();
    },

    methods: {
      addNewRule() {
        this.queryRules.push({ field: null, modifier: null, term: null });
        this.validations.push({ state: true });
      },
      clearRule(index) {
        this.queryRules.splice(index, 1);
        this.validations.splice(index, 1);
        if (this.queryRules.length === 0) {
          this.addNewRule();
        }
        this.handleSubmitForm();
      },
      handleRuleChange(newVal) {
        if (this.advancedSearchRuleIsValid(newVal)) {
          this.handleSubmitForm();
        }
      },
      handleSubmitForm() {
        // let v-model changes percolate down to child components first, required
        // for validation during form submission, e.g. when modifiers change
        // based on term selection
        this.$nextTick(() => {
          this.validateRules();
          const allRulesValid = this.validations.every(this.advancedSearchRuleValidationsPass);
          if (allRulesValid) {
            this.trackAdvancedSearch();
            this.$store.commit('search/setLoggableInteraction', true);
            this.$router.push(this.advancedSearchRouteQueryFromRules(this.nonEmptyQueryRules));
          }
        });
      },
      initRulesFromRouteQuery() {
        // FIXME: this gets called too often on 1st load
        // console.log('SearchQueryBuilder initRulesFromRouteQuery');
        this.queryRules = this.advancedSearchRulesFromRouteQuery();
        if (this.queryRules.length === 0) {
          this.addNewRule();
        } else {
          this.validations = Array(this.queryRules.length).fill({ state: true });
          this.$emit('show', true);
        }
      },
      trackAdvancedSearch() {
        if (!this.$matomo) {
          return;
        }

        for (const rule of this.nonEmptyQueryRules) {
          const fieldLabel = this.advancedSearchFieldLabel(rule.field, 'en');
          const modifierLabel = this.$t(`search.advanced.modifiers.${rule.modifier}`, 'en');
          const eventName = `Adv search: ${fieldLabel} ${modifierLabel}`;
          this.$matomo.trackEvent('Adv search', 'Apply adv search', eventName);
        }
      },
      validateRules() {
        this.validations = this.queryRules.map(this.advancedSearchRuleValidations);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';

  .search-query-builder {
    margin-left: -15px;
    margin-right: -15px;
    width: auto;

    @media (min-width: $bp-large) {
      margin-top: -1rem;
      box-shadow: $boxshadow-small;
    }

    @media (min-width: $bp-xxxl) {
      margin-left: -4rem;
      margin-right: -4rem;
      padding-left: 4rem;
      padding-right: 4rem;
    }

    .container {
      padding: 0;
    }

    @media (min-width: $bp-4k) {
      margin-top: -1.5rem;
      padding-top: 1.5rem !important;
      padding-bottom: 1.5rem !important;
    }
  }
</style>

<docs lang="md">
  ```jsx
    <SearchQueryBuilder />
  ```
</docs>
