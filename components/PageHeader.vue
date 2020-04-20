<template>
  <b-container
    fluid
    class="border-bottom p-0 mb-3"
  >
    <b-navbar
      class="pb-3 pt-3 py-lg-1 px-lg-3 flex-column flex-lg-row"
      data-qa="header"
    >
      <b-navbar-brand
        class="col-lg-2 p-0 m-0 text-center text-lg-left"
      >
        <SmartLink
          :destination="{ name: 'index' }"
        >
          <img
            src="../assets/img/logo.svg"
            :alt="$t('homeLinkAlt')"
            class="mb-2 mb-sm-0 mw-100"
            data-qa="logo"
          >
        </SmartLink>
      </b-navbar-brand>
      <SearchForm
        data-qa="search form"
        class="col-lg w-100 px-3 mr-auto mx-xl-auto"
        :enable-auto-suggest="enableAutoSuggest"
        :enable-suggestion-validation="enableSuggestionValidation"
      />
      <PageNavigation />
    </b-navbar>
  </b-container>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import SearchForm from './search/SearchForm';
  import PageNavigation from './PageNavigation';

  export default {
    components: {
      SmartLink,
      SearchForm,
      PageNavigation
    },

    props: {
      enableAutoSuggest: {
        type: Boolean,
        default: false
      },
      enableSuggestionValidation: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container-fluid {
    background: $white;
  }

  .navbar-brand{
    min-width: 11.0625rem;
  }

  .form-inline {
    width: 40%;
  }
  @media (min-width: $bp-large) {
    .form-inline{
      max-width: 37.5rem;
    }
  }
</style>
