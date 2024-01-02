<template>
  <header
    id="header"
    v-visible-on-scroll
    class="page-header show xxl-page"
    role="banner"
    :aria-label="$t('ds4ch.dataSpaceForCulturalHeritage')"
    data-qa="header"
  >
    <b-navbar
      role="navigation"
      class="d-flex align-items-center justify-content-between"
    >
      <SmartLink
        destination="#"
        class="logo d-inline-flex"
      >
        <img
          :src="logoSrc"
          :alt="$t('ds4chHome')"
          data-qa="logo"
        >
      </SmartLink>
      <DS4CHPageNavigation
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
      bg-variant="dark"
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
      <DS4CHPageNavigation
        data-qa="top navigation"
        class="px-4"
      />
    </b-sidebar>
  </header>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import DS4CHPageNavigation from './DS4CHPageNavigation';

  export default {
    name: 'DS4CHPageHeader',

    components: {
      SmartLink,
      DS4CHPageNavigation
    },

    data() {
      return {
        logoSrc: require('@europeana/style/img/DS4CHlogo.svg')
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  ::v-deep .b-sidebar-backdrop.bg-black {
    background-color: $black;
    opacity: 0.7;
  }

  ::v-deep .b-sidebar {
    width: 16rem;
    max-height: 100vh;
    transition: $standard-transition; // fixes header appear/disappear
    border-left: 1px solid $white;
  }

  .page-header {
    background-color: $black;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 10;

    @media (min-width: $bp-large) {
      transition: $standard-transition;
    }

    &:not(.show) {
      #sidebar,
      .b-sidebar-backdrop {
        transform: translateY(3.5rem);
        transition: $standard-transition;
      }
    }
  }

  .navbar {
    height: 3.5rem;
    margin-left: 2rem;
    margin-right: 2rem;

    @media (min-width: $bp-large) {
      margin-left: 4rem;
      margin-right: 3.5rem;
    }

    @media (min-width: $bp-4k) {
      height: 5rem;
      margin-left: 10.625rem;
      margin-right: 9.8125rem;
    }
  }

  .logo {
    height: 2.4375rem;
    width: auto;

    @media (min-width: $bp-4k) {
      height: calc(1.5 * 2.4375rem);
    }

    img {
      height: 100%;
    }
  }

  .navbar-toggle {
    font-size: $font-size-extrasmall;
    padding: 0;

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        font-size: $font-size-extrasmall-4k;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  import '@europeana/style/scss/DS4CH/style.scss';

  <DS4CHPageHeader style="position: relative;"/>
  ```
</docs>
