<template>
  <b-container
    ref="nav-container"
    v-visible-on-scroll
    fluid
    class="border-bottom mb-3 d-flex py-1 py-lg-1 px-lg-3 flex-column flex-lg-row"
    data-qa="header"
  >
    <header
      class="col p-0 m-0 text-center text-lg-left navbar-brand d-flex align-items-center justify-content-between justify-content-lg-start flex-row"
      role="banner"
      aria-label="Europeana home"
    >
      <b-button
        v-b-toggle.collapse-1
        variant="light"
        class="navbar-toggle collapsed p-0 flex-column align-items-center justify-content-center"
      >
        <span></span>
        <span></span>
        <span></span>
      </b-button>
      <SmartLink
        :destination="{ name: 'index' }"
        class="logo"
      >
        <img
          src="../assets/img/logo.svg"
          :alt="$t('homeLinkAlt')"
          class="mb-lg-2 mw-100"
          data-qa="logo"
        >
      </SmartLink>
      <SearchForm
        data-qa="search form"
        role="search"
        class="px-lg-3 mr-lg-auto mx-xl-auto"
        aria-label="search form"
        :enable-auto-suggest="enableAutoSuggest"
        :enable-suggestion-validation="enableSuggestionValidation"
      />
    </header>
    <b-collapse id="collapse-1" class="d-block">
      <b-navbar
        class="p-0 align-items-start justify-content-lg-end flex-column flex-lg-row"
        role="navigation"
      >
        <img
          src="../assets/img/logo.svg"
          :alt="$t('homeLinkAlt')"
          class="mb-lg-2 mw-100 mobile"
          data-qa="logo"
        >
        <PageNavigation />
      </b-navbar>
    </b-collapse>
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

  .navbar {
    position: absolute;
    height: 100vh;
    background: $white;
    z-index: 99;
    left: -100%;
    top: 0;
    transition: $standard-transition;
    width: 75%;
    .navbar-nav{
      flex-direction: column;
    }
  }
  .collapse.show{
   .navbar{
     left: 0;
   }
  }
  .navbar-toggle {
    display: flex;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    box-shadow: none;
    span {
      width: 1.125rem;
      background: $black;
      height: 2px;
      margin-bottom: 3px;
      &:last-of-type{margin-bottom: 0;}
    }
  }

  @media (min-width: $bp-large) {
    .navbar{
      position: relative;
      display: flex;
      height: auto;
      left: initial;
    }
    .navbar-toggle {
      display: none;
    }
    .form-inline {
      width: 100%;
    }
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
