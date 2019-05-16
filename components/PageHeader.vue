<template>
  <b-container
    fluid
    class="border-bottom mb-3 p-0"
  >
    <b-container class="p-0">
      <b-navbar
        class="pb-3 pt-sm-3 flex-column flex-md-row"
        data-qa="header"
      >
        <b-navbar-brand
          to="/"
          class="col-md-4 p-0 m-0 text-center text-md-left"
        >
          <img
            src="../assets/img/logo.svg"
            alt="Europeana Collections logo"
            class="mb-2 mb-sm-0 mw-100"
            data-qa="logo"
          >
        </b-navbar-brand>
        <div class="navbar-nav ml-auto w-100 col-md-6 col-lg-6 p-0 pt-3 pt-md-0">
          <SearchForm
            v-model="query"
            :is-loading="isLoading"
            class="justify-content-center justify-content-md-end w-100"
            @submit:searchForm="submitSearchForm"
          />
        </div>
      </b-navbar>
    </b-container>
  </b-container>
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

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container-fluid {
    background: $white;
  }
</style>
