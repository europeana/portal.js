<template>
  <b-container
    fluid
    class="border-bottom p-0"
  >
    <b-container class="p-0">
      <b-navbar
        class="pb-3 pt-sm-3 flex-column flex-md-row"
        data-qa="header"
      >
        <b-navbar-brand
          :to="localePath('index')"
          class="col-md-4 p-0 m-0 text-center text-md-left"
        >
          <img
            src="../assets/img/logo.svg"
            :alt="$t('homeLinkAlt')"
            class="mb-2 mb-sm-0 mw-100"
            data-qa="logo"
          >
        </b-navbar-brand>
        <div class="navbar-nav ml-auto w-100 col-md-6 col-lg-6 p-0 pt-3 pt-md-0 mr-auto">
          <SearchForm
            v-model="query"
            data-qa="search form"
            :is-loading="isLoading"
            class="justify-content-center justify-content-md-end w-100"
            @submit:searchForm="submitSearchForm"
          />
        </div>
        <LangSelector data-qa="language selector" />
      </b-navbar>
    </b-container>
  </b-container>
</template>

<script>
  import SearchForm from './search/SearchForm';
  import LangSelector from './generic/LanguageSelector';

  export default {
    components: {
      SearchForm,
      LangSelector
    },
    props: {
      searchQuery: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        query: (this.searchQuery || {}).query || '',
        isLoading: false
      };
    },
    watch: {
      searchQuery: {
        immediate: true,
        handler(val = {}) {
          this.query = val.query || '';
        }
      }
    },
    methods: {
      submitSearchForm() {
        const newSearchQuery = { ...this.searchQuery, ...{ query: this.query, page: 1 } };
        this.$router.push(this.localePath({ name: 'search', query: newSearchQuery }));
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container-fluid {
    background: $white;
  }
</style>
