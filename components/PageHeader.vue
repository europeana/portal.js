<template>
  <b-container
    ref="nav-container"
    v-visible-on-scroll
    fluid
    class="border-bottom d-flex py-0 px-lg-3 flex-column flex-lg-row align-items-center"
    data-qa="header"
  >
    <header
      class="col p-0 m-0 text-center text-lg-left navbar-brand d-flex align-items-center justify-content-between justify-content-lg-start flex-row"
      role="banner"
      aria-label="Europeana home"
    >
      <b-button
        v-show="!showSearch"
        @click="showSidebar = !showSidebar"
        variant="light"
        class="navbar-toggle collapsed ml-3 p-0 flex-column align-items-center justify-content-center"
      >
        <span />
        <span />
        <span />
      </b-button>
      <SmartLink
        v-show="!showSearch"
        :destination="{ name: 'index' }"
        class="logo d-lg-block"
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
    <b-navbar
      class="p-lg-0 align-items-start justify-content-lg-end flex-column flex-lg-row desktop-navigation d-none d-lg-block"
      role="navigation"
    >
      <PageNavigation />
    </b-navbar>
    <transition name="slide">
      <b-navbar
        v-if="showSidebar"
        class="p-lg-0 align-items-start justify-content-lg-end flex-column flex-lg-row"
        role="navigation"
      >
        <SmartLink
          :destination="{ name: 'index' }"
          class="logo d-block d-lg-none px-2"
        >
          <img
            src="../assets/img/logo.svg"
            :alt="$t('homeLinkAlt')"
            class="mb-lg-2 mw-100"
            data-qa="logo"
          >
        </SmartLink>
        <PageNavigation />
        <span
          @click="showSidebar = !showSidebar"
          class="navbar-toggle close-menu"
        />
      </b-navbar>
    </transition>
  </b-container>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import SearchForm from './search/SearchForm';
  import PageNavigation from './PageNavigation';
  import { mapState } from 'vuex';

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
    },

    data() {
      return {
        showSidebar: false,
        windowWidth: 0
      };
    },

    computed: {
      ...mapState({
        showSearch: state => state.ui.showSearch,
        onDesktop: state => state.ui.onDesktop,
        onMobile: state => state.ui.onMobile
      })
    },

    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth();
      });
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
    },

    methods: {
      getWindowWidth() {
        this.windowWidth = document.documentElement.clientWidth;
        if (this.windowWidth >= 992 && this.onMobile) {
          this.$store.commit('ui/onDesktop', true);
          this.$store.commit('ui/onMobile', false);
        } else if (this.windowWidth <= 991 && this.onDesktop) {
          this.$store.commit('ui/onDesktop', false);
          this.$store.commit('ui/onMobile', true);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container-fluid {
    background: $white;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 1030;
    padding: 0;
    box-shadow: $boxshadow-light;
  }

  .slide-enter-active {
    transition: .3s cubic-bezier(0.24,1,0.32,1);
  }

  .slide-leave-active {
    transition: .2s cubic-bezier(0.4,0.0,1,1);
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }

  .navbar-brand {
    min-width: 11.0625rem;
    .logo {
      min-width: 9.5625rem;
      padding: 0.735rem 0 !important;
      transition: .3s ease-in-out;
      img {
        width: 9.5625rem;
      }
    }
  }

  @media (max-width: $bp-large) {
    .navbar-brand {
      flex: 0 0 auto;
    }
    .navbar {
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      background: $white;
      z-index: 99;
      width: 16rem;
      padding: 1rem 0.5rem;
      /* transform: translate3d(-100%, 0, 0); */
      /* transition: .3s cubic-bezier(0.24,1,0.32,1); */
      &:after {
        content: '';
        background-color: rgba(0, 0, 0, 0.7);
        height: 100vh;
        width: calc(100% - 16rem);
        position: fixed;
        z-index: 2;
        top: 0;
        right: 0;
        pointer-events: none;
        /* transition: .3s cubic-bezier(0.24,1,0.32,1); */
      }
      .close-menu {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        width: calc(100% - 16rem);
        border-radius: 0;
        background-color: transparent;
        outline: none;
        transition: .2s;
        cursor: pointer;
        /* opacity: 0; */
      }
      .navbar-nav {
        padding-top: 1rem;
        flex-direction: column;
        width: 100%;
      }
    }
    #menu {
      /* width: 100%; */
      /* height: 100vh;
      position: fixed;
      top: 0;
      left: 0; */
      /* pointer-events: none; */
      /* transition: .3s cubic-bezier(0.24,1,0.32,1); */
      /* &.show {
        pointer-events: all;
        opacity: 1;
        transition: .2s cubic-bezier(0.4,0.0,1,1);
      } */
      /* .close-menu {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        width: calc(100% - 16rem);
        border-radius: 0;
        background: transparent;
        outline: none;
      } */
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
  }

  @media (min-width: $bp-large) {
    .navbar {
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
