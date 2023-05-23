<template>
  <b-row
    class="search-query-builder py-3"
  >
    <b-col>
      <section
        :id="id"
        role="search"
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
              :search-term="rule.searchTerm"
              :selected-field="rule.selectedField"
              :selected-modifier="rule.selectedModifier"
              :search-fields="searchFields"
              :modifiers="modifiers"
              @change="(field, value) => rule[field] = value"
            />
            <b-button
              :data-qa="`clear rule button ${index}`"
              :disabled="disableClearRuleButton"
              variant="light"
              class="d-inline-flex align-items-center ml-auto ml-lg-1"
              @click="clearRule(index)"
            >
              <span class="icon-cancel-circle pr-1" />
              {{ $t('search.advanced.actions.clear') }}
            </b-button>
          </div>
        </transition-group>
        <b-button
          data-qa="search rules button"
          variant="primary"
          class="d-inline-flex align-items-center mr-3"
          @click="searchWithBuildQueries"
        >
          <span class="icon-search pr-1" />
          {{ $t('search.advanced.actions.search') }}
        </b-button>
        <b-button
          data-qa="add rule button"
          variant="light"
          class="d-inline-flex align-items-center"
          @click="addNewRule"
        >
          <span class="icon-ic-add pr-1" />
          {{ $t('search.advanced.actions.add') }}
        </b-button>
      </section>
    </b-col>
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
      }
    },

    data() {
      return {
        queryRules: [{}],
        searchFields: [
          // TODO: replace values with query syntax
          { value: null, text: this.$t('search.advanced.selectOne') },
          { value: 'a', text: this.$t('search.advanced.fields.anyField') },
          { value: 'b', text: this.$t('search.advanced.fields.subject') },
          { value: 'c', text: this.$t('search.advanced.fields.title') },
          { value: 'd', text: this.$t('search.advanced.fields.description') },
          { value: 'e', text: this.$t('search.advanced.fields.creator') },
          { value: 'f', text: this.$t('search.advanced.fields.type') }
        ],
        modifiers: [
          // TODO: replace values with query syntax
          { value: null, text: this.$t('search.advanced.selectOne') },
          { value: 'a', text: this.$t('search.advanced.modifiers.contains') },
          { value: 'b', text: this.$t('search.advanced.modifiers.notContain') },
          { value: 'c', text: this.$t('search.advanced.modifiers.is') },
          { value: 'd', text: this.$t('search.advanced.modifiers.isNot') },
          { value: 'e', text: this.$t('search.advanced.modifiers.startsWith') },
          { value: 'f', text: this.$t('search.advanced.modifiers.endsWith') }
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
      currentURLQuery(newVal) {
        this.$emit('show', !!newVal);
      }
    },

    mounted() {
      if (this.currentURLQuery) {
        this.$emit('show', true);
      }
    },

    methods: {
      addNewRule() {
        this.queryRules.push({});
      },
      clearRule(index) {
        if (this.queryRules.length > 1) {
          this.queryRules.splice(index, 1);
        }
      },
      searchWithBuildQueries() {
        // Go to search results with created queries
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
