<template>
  <b-container
    fluid
    class="border-bottom p-0 mb-3"
  >
    <b-container class="p-0">
      <b-navbar
        class="pb-3 pt-3 flex-column flex-xl-row"
        data-qa="header"
      >
        <b-navbar-brand
          class="col-xl-3 p-0 m-0 text-center text-xl-left"
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
          class="col-xl-5 w-100 py-3 py-xl-0"
          :enable-auto-suggest="enableAutoSuggest"
          :enable-suggestion-validation="enableSuggestionValidation"
        />
        <PageNavigation />
      </b-navbar>
    </b-container>
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

  .form-inline {
    width: 40%;
  }
</style>
