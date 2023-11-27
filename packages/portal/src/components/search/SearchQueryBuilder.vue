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
                    v-model="queryRules[index]"
                    :tooltips="index === 0"
                    :validate="validatingRules"
                    @change="(field, value) => handleChangeRule(index, field, value)"
                    @clear="clearRule(index)"
                    @invalid="handleInvalidRule(index)"
                    @valid="handleValidRule(index)"
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
                </b-button>
              </div>
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
      }
    },

    data() {
      return {
        queryRules: [],
        validatingRules: false,
        validations: []
      };
    },

    computed: {
      validQueryRules() {
        return this.queryRules.filter(this.checkIfValidRule);
      }
    },

    watch: {
      '$route.query.qa': 'initRulesFromRouteQuery'
    },

    created() {
      this.initRulesFromRouteQuery();
    },

    methods: {
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        this.queryRules.splice(index, 1);
        this.validations.splice(index, 1);
        if (this.queryRules.length === 0) {
          this.addNewRule();
        }
        this.handleSubmitForm();
      },
      handleChangeRule(index, field, value) {
        this.queryRules[index][field] = value;
        const validRule = this.checkIfValidRule(this.queryRules[index]);
        if (validRule || field === 'term') {
          this.handleSubmitForm();
        }
      },
      handleInvalidRule(index) {
        this.validations[index] = false;
      },
      handleSubmitForm() {
        this.validateRules((valid) => {
          if (valid) {
            this.trackAdvancedSearch();
            this.$store.commit('search/setLoggableInteraction', true);
            this.$router.push(this.advancedSearchRouteQueryFromRules(this.validQueryRules));
          }
        });
      },
      handleValidRule(index) {
        this.validations[index] = true;
      },
      initRulesFromRouteQuery() {
        this.queryRules = this.advancedSearchRulesFromRouteQuery();
        if (this.queryRules.length === 0) {
          this.addNewRule();
        } else {
          this.$emit('show', true);
        }
      },
      checkIfValidRule(rule) {
        return Boolean(rule.field && rule.modifier && rule.term);
      },
      trackAdvancedSearch() {
        if (!this.$matomo) {
          return;
        }

        for (const rule of this.validQueryRules) {
          const fieldLabel = this.advancedSearchFieldLabel(rule.field, 'en');
          const modifierLabel = this.$t(`search.advanced.modifiers.${rule.modifier}`, 'en');
          const eventName = `Adv search: ${fieldLabel} ${modifierLabel}`;
          this.$matomo.trackEvent('Adv search', 'Apply adv search', eventName);
        }
      },
      validateRules(callback) {
        // Instruct the SearchQueryBuilderRule components to validate themselves
        this.validatingRules = true;

        // Give the SearchQueryBuilderRule components time to validate and emit
        // validation statuses which will be stored in `this.validations`
        this.$nextTick(() => {
          // Instruct the SearchQueryBuilderRule components to stop validating,
          // so that they only revalidate when the form is next submitted.
          this.validatingRules = false;

          callback(this.validations.every((validation) => validation));
        });
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
