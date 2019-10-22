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
        <div class="navbar-nav ml-auto w-100 col-md-6 col-lg-6 p-0 pt-3 pt-md-0">
          <AutoSuggest
            data-qa="search form"
            class="justify-content-center justify-content-md-end w-100"
          />
        </div>
        <LangSelector
          v-if="enableLanguageSelector"
          data-qa="language selector"
        />
      </b-navbar>
    </b-container>
  </b-container>
</template>

<script>
  import AutoSuggest from './search/AutoSuggest';
  import LangSelector from './generic/LanguageSelector';

  export default {
    components: {
      AutoSuggest,
      LangSelector
    },
    props: {
      enableLanguageSelector: {
        type: Boolean,
        default: Boolean(Number(process.env['ENABLE_LANGUAGE_SELECTOR']))
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
