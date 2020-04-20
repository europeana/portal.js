<template>
  <b-container
    v-scroll="handleDebouncedScroll"
    fluid
    class="border-bottom p-0 mb-lg-3"
  >
    <b-navbar
      class="pb-3 pt-0 py-lg-1 px-lg-3 flex-column flex-lg-row"
      data-qa="header"
    >
      <b-navbar-brand
        class="col-lg-2 p-0 m-0 text-center text-lg-left d-none d-lg-block"
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
        class="col-lg w-100 px-0 px-lg-3 mr-auto mx-xl-auto"
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
  import debounce from 'lodash/debounce';

  export default {
    components: {
      SmartLink,
      SearchForm,
      PageNavigation
    },

    directives: {
      // https://vuejs.org/v2/cookbook/creating-custom-scroll-directives.html
      scroll: {
        inserted: (el, binding) => {
          let f = (evt) => {
            if (binding.value(evt, el)) {
              window.removeEventListener('scroll', f);
            }
          };
          window.addEventListener('scroll', f);
        }
      }
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
    },

    data() {
      return {
        scrollPosition: 0,
        windowWidth: 992
      };
    },

    mounted() {
      this.scrollPosition = window.scrollY;
      this.getWindowWidth();
      this.$nextTick(() => {
        window.addEventListener('resize', this.handleDebouncedGetWindowWidth);
      });
    },

    created() {
      this.handleDebouncedScroll = debounce(this.handleScroll, 100);
      this.handleDebouncedGetWindowWidth = debounce(this.getWindowWidth, 100);
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.handleDebouncedGetWindowWidth);
    },

    methods: {
      handleScroll(evt, el) {
        if (this.windowWidth <= 991) {
          if (this.scrollPosition < window.scrollY) {
            this.scrollPosition = window.scrollY;
            el.setAttribute(
              'style',
              'opacity: 1; transform: translate3d(0, 150px, 0)'
            );
          } else if (this.scrollPosition > window.scrollY) {
            this.scrollPosition = window.scrollY;
            el.setAttribute(
              'style',
              'opacity: 1; transform: translate3d(0, 0, 0)'
            );
          }
        }
      },
      getWindowWidth() {
        this.windowWidth = document.documentElement.clientWidth;
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
  @media (max-width: $bp-large){
    .container-fluid{
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1030;
      border-bottom: none !important;
      transition: 0.3s ease-in-out;
    }
  }
</style>
