<template>
  <b-navbar class="border-bottom pb-3 pt-sm-3 mb-3" data-qa="header">
    <b-navbar-brand
      href="/"
      class="col-md-4 p-0"
    >
      <img
        src="../assets/img/logo.svg"
        alt="Europeana Collections logo"
        class="mb-2 mb-sm-0 mw-100"
        data-qa="header logo"
      >
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto w-100 col-md-5 col-lg-4 p-0">
      <b-nav-form
        class="justify-content-center justify-content-sm-end"
        @submit.prevent="submitSearchForm"
      >
        <b-form-input
          v-model="query"
          size="sm"
          type="text"
          class="mr-2 w-75"
          placeholder="What are you looking for?"
          name="query"
          data-qa="search query input"
        />
        <b-button
          size="sm"
          type="submit"
          data-qa="search submit button"
        >
          <img
            src="../assets/img/magnifier.svg"
            alt="Search"
          >
        </b-button>
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
  export default {
    data () {
      return {
        query: null
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
