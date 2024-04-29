<template>
  <header
    id="header"
    v-visible-on-scroll
    class="page-header m-0 show xxl-page"
    role="banner"
    data-qa="header"
  >
    <b-navbar
      role="navigation"
      class="header-navbar d-flex align-items-center justify-content-end"
    >
      <SmartLink
        :destination="{ name: 'index' }"
        class="logo d-inline-flex mt-1 mr-lg-auto ml-lg-0 pl-4 pl-lg-0"
      >
        <img
          :src="logoSrc"
          :alt="$t('homeLinkAlt')"
          data-qa="logo"
        >
      </SmartLink>
      <LandingPageNavigation
        class="d-none d-lg-flex"
        data-qa="top navigation"
      />
      <b-button
        v-b-toggle.sidebar
        variant="light-flat"
        class="navbar-toggle button-icon-only d-lg-none"
        :aria-label="$t('header.showSidebar')"
        data-qa="hamburger button"
      >
        <span class="icon icon-menu" />
      </b-button>
    </b-navbar>
    <b-sidebar
      id="sidebar"
      bg-variant="white"
      right
      no-header
      backdrop
      backdrop-variant="black"
      :aria-label="$t('header.sideNavigation')"
      class="d-lg-none"
    >
      <header class="m-3">
        <b-button
          v-b-toggle.sidebar
          data-qa="close menu button"
          class="button-icon-only icon-clear"
          variant="light-flat"
          :aria-label="$t('header.closeSidebar')"
        />
      </header>
      <LandingPageNavigation
        data-qa="top navigation"
        class="px-4"
      />
    </b-sidebar>
  </header>
</template>

<script>
  import visibleOnScrollDirective from '@europeana/vue-visible-on-scroll';

  import LandingPageNavigation from '@/components/landing/LandingPageNavigation';
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'LandingPageHeader',

    components: {
      LandingPageNavigation,
      SmartLink
    },

    directives: {
      'visible-on-scroll': visibleOnScrollDirective
    },

    data() {
      return {
        logoSrc: require('@europeana/style/img/landing/apis-logo.svg')
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/icons';

  ::v-deep .b-sidebar-backdrop.bg-black {
    background-color: rgb(0 0 0);
    opacity: 0.7;
  }

  ::v-deep #sidebar {
    width: 16rem;
    max-height: 100vh;
    transition: $standard-transition; // fixes header appear/disappear

    @media (min-width: $bp-4k) {
      width: calc(1.5 * 16rem);
    }
  }

  .page-header {
    background: $white;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    padding: 0;
    z-index: 11;

    @media (min-width: $bp-large) {
      transition: $standard-transition;
    }
  }

  .navbar-toggle {
    font-size: $font-size-extrasmall;
    padding: 0;

    span {
      transition: $standard-transition;
    }

    &:hover {
      span::before {
        color: $innovationblue;
        transition: $standard-transition;
      }
    }
  }

  .header-navbar {
    height: 3.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    box-shadow: $boxshadow-small;

    @media (min-width: $bp-large) {
      padding-left: 4rem;
      padding-right: 3.5rem;
    }

    @media (min-width: $bp-4k) {
      height: 5rem;
      padding-left: 10.625rem;
      padding-right: 9.8125rem;
    }

    .logo {
      img {
        margin: auto 0;
        width: auto;
        height: 2rem;

        @media (min-width: $bp-4k) {
          height: 3rem;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <LandingPageHeader style="position: relative;"/>
  ```
</docs>
