<template>
  <header
    v-visible-on-scroll
    class="m-0 navbar-brand container-fluid d-flex justify-content-between show"
    role="banner"
    :aria-label="$t('header.europeanaHome')"
    data-qa="header"
  >
    <div
      v-if="showSearch"
      class="d-flex justify-content-center w-100"
    >
      <b-button
        data-qa="back button"
        class="back"
        variant="light"
        :aria-label="$t('header.backToMenu')"
        @click="toggleSearchBar"
      />
      <SearchForm
        role="search"
        aria-label="search form"
        data-qa="search form"
      />
    </div>
    <template
      v-else
    >
      <b-button
        variant="light"
        class="navbar-toggle collapsed flex-column align-items-center justify-content-center align-self-center ml-3"
        :aria-label="$t('header.showSidebar')"
        data-qa="hamburger button"
        @click="showSidebar = !showSidebar"
      >
        <span />
        <span />
        <span />
      </b-button>
      <SmartLink
        :destination="{ name: 'index' }"
        class="logo pl-lg-3"
      >
        <img
          src="../assets/img/logo.svg"
          :alt="$t('homeLinkAlt')"
          class="mw-100"
          data-qa="logo"
        >
      </SmartLink>
      <b-navbar
        class="align-items-center flex-row d-flex p-0 mr-3"
        role="navigation"
      >
        <PageNavigation
          v-if="mainNavigation"
          class="d-none d-lg-flex"
          :links="mainNavigation.links"
          data-qa="desktop navigation"
        />
        <b-button
          data-qa="show search button"
          class="search ml-lg-3"
          variant="light"
          :aria-label="$t('search')"
          @click="toggleSearchBar"
        />
      </b-navbar>
      <transition name="slide">
        <b-navbar
          v-if="showSidebar"
          class="mobile-nav p-lg-0 align-items-start justify-content-lg-end flex-column flex-lg-row d-lg-none"
          role="navigation"
          data-qa="mobile navigation"
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
          <PageNavigation
            v-if="mobileNavigation"
            :links="mobileNavigation.links"
          />
        </b-navbar>
      </transition>
      <transition name="fade">
        <span
          v-if="showSidebar"
          class="close-menu"
          @click="showSidebar = !showSidebar"
        />
      </transition>
    </template>
  </header>
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
      mainNavigation: {
        type: Object,
        default: null
      },
      mobileNavigation: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        showSidebar: null,
        windowWidth: 0
      };
    },

    computed: {
      ...mapState({
        showSearch: state => state.search.showSearchBar
      })
    },

    watch: {
      '$route'() {
        if (this.showSidebar) {
          this.showSidebar = false;
        }
      }
    },

    methods: {
      toggleSearchBar() {
        this.$store.commit('search/setShowSearchBar', !this.$store.state.search.showSearchBar);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';
  @import '../assets/scss/icons.scss';

  .container-fluid {
    background: $white;
    height: 3.5rem;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 1030;
    padding: 0;

    &:not(.show) ::v-deep .search-query,
    &:not(.show) ::v-deep .auto-suggest-dropdown {
      display: none;
    }
  }

  .slide-enter-active, .fade-enter-active {
    transition: 0.3s cubic-bezier(0.24, 1, 0.32, 1);
  }

  .slide-leave-active, .fade-leave-active {
    transition: 0.2s cubic-bezier(0.4, 0.0, 1, 1);
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(-100%, 0, 0);
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .navbar-brand {
    min-width: 11.0625rem;
    flex: 0 0 auto;
    .logo {
      min-width: 9.5625rem;
      padding-bottom: 0.735rem;
      padding-top: 0.735rem;
      transition: 0.3s ease-in-out;
      img {
        width: 9.5625rem;
      }
    }
  }

  .navbar.mobile-nav {
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: $white;
    z-index: 99;
    width: 16rem;
    padding: 1rem 0.5rem;
    .navbar-nav {
      padding-top: 1rem;
      flex-direction: column;
      width: 100%;
    }
  }

  .btn {
    align-items: center;
    background: none;
    border-radius: 0;
    border: 0;
    box-shadow: none;
    color: $black;
    display: flex;
    font-size: 1rem;
    height: 1.5rem;
    justify-content: center;
    padding: 0;
    width: 1.5rem;

    &:before {
      @extend .icon-font;
      display: inline-block;
      font-size: 1.1rem;
    }

    &.search {
      &:before {
        content: '\e92b';
        transition: $standard-transition;
      }
      &:hover {
        &:before {
          color: $altblue;
        }
      }
    }

    &.back {
      position: absolute;
      left: 1rem;
      top: 1rem;
      z-index: 99;

      &:before {
        content: '\ea40';
      }
    }
  }

  @media (max-width: $bp-large) {
    .close-menu {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      width: 100%;
      border-radius: 0;
      outline: none;
      transition: 0.5s;
      background-color: rgba(0, 0, 0, 0.7);
      cursor: pointer;
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
        &:last-of-type { margin-bottom: 0; }
      }
    }
  }

  @media (min-width: $bp-large) {
    .navbar {
      position: relative;
      display: flex;
      height: auto;
      left: initial;
      top: initial;
      width: auto;
      padding: 0;
      .navbar-nav {
        padding-top: 0;
        flex-direction: row;
        width: 100%;
      }
    }
    .navbar-brand {
      flex: 3;
    }
    .navbar-toggle {
      display: none;
    }
    @media (max-width: $bp-large) {
      .navbar-brand {
        justify-content: center;
      }
    }
    .container-fluid {
      transition: $standard-transition;
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
