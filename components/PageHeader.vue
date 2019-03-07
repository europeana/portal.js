<template>
  <b-navbar
    class="border-bottom pb-3 pt-sm-3 mb-3"
    data-qa="header"
  >
    <b-navbar-brand
      href="/"
      class="col-md-4 p-0"
    >
      <img
        src="../assets/img/logo.svg"
        alt="Europeana Collections logo"
        class="mb-2 mb-sm-0 mw-100"
        data-qa="logo"
      >
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto w-100 col-md-5 col-lg-4 p-0">
      <SearchForm
        v-model="query"
        class="justify-content-center justify-content-sm-end"
        :is-loading="isLoading"
        @submit:searchForm="submitSearchForm"
      />
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
  import SearchForm from './search/SearchForm';

  export default {
    components: {
      SearchForm
    },
    data () {
      return {
        query: null,
        isLoading: false
      };
    },
    methods: {
      submitSearchForm () {
        this.$router.push({ name: 'search', query: { query: this.query ? this.query : '' } });
        this.query = '';
      }
    }
  };
</script>
