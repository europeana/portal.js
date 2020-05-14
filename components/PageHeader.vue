<template>
  <b-container
    ref="nav-container"
    v-visible-on-scroll
    fluid
    class="border-bottom mb-3 d-flex py-3 py-lg-1 px-lg-3 flex-column flex-lg-row"
    data-qa="header"
  >
    <header
      class="col-lg p-0 m-0 text-center text-lg-left navbar-brand d-flex align-items-center justify-content-center justify-content-lg-start flex-column flex-lg-row"
      role="banner"
      aria-label="Europeana home"
    >
      <SmartLink
        :destination="{ name: 'index' }"
        class="logo"
      >
        <img
          src="../assets/img/logo.svg"
          :alt="$t('homeLinkAlt')"
          class="mb-2 mb-sm-0 mw-100"
          data-qa="logo"
        >
      </SmartLink>
      <SearchForm
        data-qa="search form"
        role="search"
        class="w-100 px-3 mr-auto mx-xl-auto"
        aria-label="search form"
        :enable-auto-suggest="enableAutoSuggest"
        :enable-suggestion-validation="enableSuggestionValidation"
      />
    </header>
    <b-navbar
      class="p-0 justify-content-center justify-content-lg-end"
      role="navigation"
    >
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

  .navbar-brand {
    min-width: 11.0625rem;
    .logo {
      min-width: 9.5625rem;
      transition: .3s ease-in-out;
      img {
        width: 9.5625rem;
      }
    }
  }

  .form-inline {
    width: 40%;
  }
  @media (min-width: $bp-large) {
    @media (max-width: $bp-large) {
      .navbar-brand {
        justify-content: center;
      }
    }
    .container-fluid {
      position: fixed;
      right: 0;
      top: 0;
      left: 0;
      z-index: 1030;
      border-bottom: none !important;
      transition: $standard-transition;
    }
    .form-inline {
      max-width: 37.5rem;
    }
  }
  @media (min-width: $bp-extralarge) {
    .navbar-brand {
      .logo {
        min-width: 18.75rem;
      }
    }
  }
</style>
