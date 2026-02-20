<template>
  <b-navbar-nav
    class="ml-xl-auto top-navbar"
    data-qa="main navigation"
  >
    <li
      v-for="(link, index) in links"
      :key="index"
      class="nav-item"
      :class="{ 'sidebar-nav-item': sidebarNav }"
    >
      <b-link
        v-b-toggle.menu
        :to="link.to || localePath(link.url)"
        :target="null"
        :data-qa="link.dataQa"
        class="nav-link"
      >
        <span
          v-if="sidebarNav"
          :class="renderIcon(link.url)"
        />
        <span class="nav-link-text">
          {{ link.text }}
        </span>
      </b-link>
    </li>
  </b-navbar-nav>
</template>

<script>
  export default {
    name: 'PageNavigation',

    props: {
      sidebarNav: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      authLinks() {
        return this.isAuthenticated ? [
          { url: '/account', text: this.$t('account.title'), dataQa: 'account link' },
          this.sidebarNav && { url: '/account/logout', to: '/account/logout', text: this.$t('account.linkLogout'), dataQa: 'log out link' }
        ] : [
          { url: '/account/login', to: { name: 'account-login', query: { redirect: this.$route.fullPath } }, text: this.$t('account.linkLoginJoin'), dataQa: 'log in link' }
        ];
      },
      mainNavigation() {
        return [
          { url: '/', text: this.$t('header.navigation.home') },
          { url: '/collections', text: this.$t('header.navigation.collections') },
          { url: '/stories', text: this.$t('header.navigation.stories') },
          { url: '/share-your-collections', text: this.$t('header.navigation.shareYourCollections') }
        ];
      },
      sidebarNavigation() {
        return [
          { url: '/europeana-classroom', text: this.$t('header.navigation.europeanaClassroom') },
          { url: '/about-us', text: this.$t('header.navigation.about') },
          { url: '/help', text: this.$t('header.navigation.help') },
          { url: '/feature-ideas', text: this.$t('header.navigation.featureIdeas') }
        ];
      },
      links() {
        return this.mainNavigation.concat(this.sidebarNav ? this.sidebarNavigation : []).concat(this.authLinks);
      },
      isAuthenticated() {
        return this.$store.state.auth.loggedIn;
      },
      isAccountPage() {
        return this.$route.name.startsWith('account');
      }
    },
    mounted() {
      window.addEventListener('storage', this.storageEvent);
    },
    methods: {
      renderIcon(url) {
        let className = '';
        switch (url) {
        case ('/collections'):
        case ('/help'):
        case ('/stories'):
        case ('/account'):
        case ('/account/login'):
        case ('/account/logout'):
        case ('/feature-ideas'):
          className = `icon-${url.split('/').pop()}`;
          break;
        case ('/'):
          className = 'icon-home';
          break;
        case ('/europeana-classroom'):
          className = 'icon-school';
          break;
        case ('/about-us'):
          className = 'icon-info';
          break;
        case ('/share-your-collections'):
          className = 'icon-institution';
          break;
        default:
          className = 'icon-info blank';
          break;
        }
        return `nav-link-icon ${className}`;
      },
      storageEvent(event) {
        if (event.key === 'logout-event') {
          this.$auth.logout();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .nav-item {
    margin-right: 1rem;

    &:nth-last-child(2) {
      margin-right: 0;
    }

    .nav-link {
      color: $darkgrey;
      text-decoration: none;
      font-size: $font-size-base;
      display: flex;
      align-items: center;

      @media (min-width: $bp-4k) {
        font-size: $font-size-base-4k;
        padding: 0.75rem;
      }

      &:hover {
        color: $innovationblue;
      }

      &.exact-active-link {
        &::after {
          content: '';
          position: absolute;
          border-bottom: solid 0.1875em $blue;
          display: block;
          width: 100%;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: 0;
          font-size: $font-size-base;

          @media (min-width: $bp-4k) {
            font-size: $font-size-base-4k;
          }
        }
      }

      .nav-link-icon {
        display: inline-block;
        font-size: $font-size-base;
        z-index: 1;
        margin-right: 0.75rem;

        @media (min-width: $bp-4k) {
          font-size: $font-size-base-4k;
        }

        &::before {
          @extend %icon-font;

          color: $greyblack;
          transition: $standard-transition;
          font-size: $font-size-large;

          @media (min-width: $bp-4k) {
            font-size: $font-size-large-4k;
          }
        }

        &.blank::before {
          color: transparent;
        }
      }
    }

    &:not(.sidebar-nav-item) {
      width: auto;
      margin: auto;

      .nav-link {
        text-transform: uppercase;
        font-size: $font-size-small;
        font-weight: 600;
        padding: 1.1rem 0.5rem;

        @media (min-width: $bp-4k) {
          font-size: $font-size-small-4k;
          padding: 1.65rem 0.75rem;
        }

        span {
          position: relative;
        }

        .nav-link-icon {
          display: none;
        }
      }
    }

    &.sidebar-nav-item {
      width: 100%;
      margin: 0 0 0.25rem;
      position: relative;

      @media (min-width: $bp-4k) {
        margin-bottom: calc(1.5 * 0.25rem);
      }

      &:nth-last-child(2) {
        margin-right: 0;
      }

      &:first-of-type,
      &:last-of-type {
        display: block;
      }

      .nav-link {
        font-weight: 400;
        border-radius: $border-radius-small;
        transition: $standard-transition;
        font-size: $font-size-base;

        @media (min-width: $bp-4k) {
          border-radius: calc(1.5 * $border-radius-small);
          font-size: $font-size-base-4k;
        }

        &.exact-active-link,
        &:hover {
          color: $white;
          background: $blue;

          &::before,
          &::after {
            display: none;
          }

          .nav-link-icon::before {
            color: $white;
          }
        }

        .nav-link-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>