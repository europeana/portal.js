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
        <span>
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
          :data-qa="item.dataQa"
          class="nav-link"
        >
          <span :class="renderIcon(item.url)" />
          <span>
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
        :href="$path({ name: 'account-login', query: { redirect: $route.fullPath } })"
        @click.prevent="keycloakLogin"
      >
        <span :class="renderIcon('/account/login')" />
        <span>
          {{ $t('account.linkLoginJoin') }}
        </span>
      </b-link>
    </li>
  </b-navbar-nav>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import keycloak from '@/mixins/keycloak';

  export default {
    name: 'PageNavigation',

    components: {
      SmartLink
    },
    mixins: [
      keycloak
    ],
    props: {
      sidebarNav: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      authLinks() {
        return [
          { to: this.$path({ name: 'account' }), text: this.$t('account.myProfile'), url: '/account', dataQa: 'likes and galleries button' },
          { href: this.keycloakAccountUrl, text: this.$t('account.profileSettings'), url: '/account/settings', dataQa: 'account settings button' },
          { to: { name: 'account-logout' }, text: this.$t('account.linkLogout'), url: '/account/logout', dataQa: 'log out button' }
        ];
      },
      mainNavigation() {
        return [
          { url: '/', text: this.$t('header.navigation.home') },
          { url: '/collections', text: this.$t('header.navigation.collections') },
          { url: '/stories', text: this.$t('header.navigation.stories') },
          { url: '/professionals', text: this.$t('header.navigation.pro') }
        ];
      },
      sidebarNavigation() {
        return [
          { url: '/europeana-classroom', text: this.$t('header.navigation.europeanaClassroom') },
          { url: '/about-us', text: this.$t('header.navigation.about') },
          { url: '/help', text: this.$t('header.navigation.help') }
        ];
      },
      links() {
        return this.mainNavigation.concat(this.sidebarNav ? this.sidebarNavigation : []);
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
        case ('/account/settings'):
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
        case ('/professionals'):
          className = 'icon-pro';
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
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .nav-item {
    margin-right: 1rem;

    &:nth-last-child(2) {
      margin-right: 0;
    }

    .nav-link {
      color: $mediumgrey;
      text-decoration: none;
      font-size: 1rem;
      display: flex;
      align-items: center;

      @media (min-width: $bp-xxxl) {
        font-size: 1vw;
        padding: 0.5em;
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
          font-size: 1rem;

          @media (min-width: $bp-xxxl) {
            font-size: 1vw;
            bottom: -0.633em;
          }
        }
      }

      &.is-external-link::after {
        @extend %icon-font;

        content: '\e900';
      }

      .nav-link-icon {
        display: inline-block;
        font-size: 1rem;
        z-index: 1;
        margin-right: 0.75rem;

        @media (min-width: $bp-xxxl) {
          font-size: 1vw;
        }

        &::before {
          @extend %icon-font;

          content: '';
          color: $black;
          transition: $standard-transition;
          font-size: 1.5rem;

          @media (min-width: $bp-xxxl) {
            font-size: 1.5vw;
          }
        }

        &.icon-home::before {
          content: '\e922';
        }

        &.icon-collections::before {
          content: '\e91d';
        }

        &.icon-pro::before {
          content: '\e95a';
        }

        &.icon-school::before {
          content: '\e952';
        }

        &.icon-info::before {
          content: '\e91f';
        }

        &.icon-help::before {
          content: '\e94f';
        }

        &.icon-login::before {
          content: '\e950';
        }

        &.icon-logout::before {
          content: '\e950';
        }

        &.icon-settings::before {
          content: '\e928';
        }

        &.icon-account::before {
          content: '\e932';
        }

        &.icon-stories::before {
          content: '\e951';
        }

        &.blank::before {
          color: transparent;
        }

        &.icon-school::before,
        &.icon-stories::before,
        &.icon-login::before,
        &.icon-help::before {
          font-size: 1.25rem;
          padding: 0.1rem;

          @media (min-width: $bp-xxxl) {
            font-size: 1.25vw;
          }
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

        @media (min-width: $bp-xxxl) {
          font-size: 0.875vw;
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
      margin-right: 0;

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

        @media (min-width: $bp-xxxl) {
          font-size: 1vw;
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

        span {
          overflow: hidden;
          white-space: nowrap;
          display: block;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
