<template>
  <b-navbar-nav
    class="ml-xl-auto top-navbar"
    data-qa="main navigation"
  >
    <li
      v-for="(link, index) in links"
      :key="index"
      class="nav-item"
      :class="sidebarNav ? 'sidebar-nav-item' : ''"
    >
      <SmartLink
        v-b-toggle.menu
        :destination="link.url"
        link-class="nav-link"
        exact
      >
        <span :class="renderIcon(link.url)" />
        <span class="nav-link-text">
          {{ link.text }}
        </span>
      </SmartLink>
    </li>
    <!-- sso links -->
    <template v-if="isAuthenticated">
      <li
        v-if="!sidebarNav"
        class="nav-item d-none d-lg-inline-block"
      >
        <SmartLink
          v-b-toggle.menu
          :destination="'/account'"
          link-class="nav-link"
          exact
        >
          <span class="label">
            {{ $t('account.myProfile') }}
          </span>
        </SmartLink>
      </li>
      <li
        v-for="item in authLinks"
        :key="item.url"
        class="nav-item d-block"
        :class="sidebarNav ? 'sidebar-nav-item' : 'd-lg-none'"
      >
        <b-link
          v-b-toggle.menu
          :to="item.to"
          :href="item.href"
          :target="null"
          :data-qa="item.dataQa"
          class="nav-link"
        >
          <span :class="renderIcon(item.url)" />
          <span class="nav-link-text">
            {{ item.text }}
          </span>
        </b-link>
      </li>
    </template>
    <li
      v-else
      class="nav-item"
      :class="sidebarNav ? 'sidebar-nav-item' : ''"
    >
      <b-link
        v-b-toggle.menu
        data-qa="log in button"
        class="nav-link"
        :target="null"
        :to="localePath({ name: 'account-login', query: { redirect: $route.fullPath } })"
      >
        <span :class="renderIcon('/account/login')" />
        <span class="nav-link-text">
          {{ $t('account.linkLoginJoin') }}
        </span>
      </b-link>
    </li>
  </b-navbar-nav>
</template>

<script>
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'PageNavigation',

    components: {
      SmartLink
    },

    props: {
      sidebarNav: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      authLinks() {
        return [
          { to: this.localePath({ name: 'account' }), text: this.$t('account.myProfile'), url: '/account', dataQa: 'likes and galleries button' },
          { href: this.$keycloak.accountUrl, text: this.$t('account.profileSettings'), url: '/account/settings', dataQa: 'account settings button' },
          { to: this.localePath(this.$keycloak.logoutRoute), text: this.$t('account.linkLogout'), url: '/account/logout', dataQa: 'log out button' }
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
        return this.mainNavigation.concat(this.sidebarNav ? this.sidebarNavigation : []);
      },
      isAuthenticated() {
        return this.$store.state.keycloak.loggedIn;
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
        case ('/account/settings'):
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
          this.$keycloak.logout();
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
          bottom: -0.6em;
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

        @media (min-width: $bp-4k) {
          font-size: $font-size-small-4k;
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
