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
    <template>
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
          :key="item.name"
          class="nav-item d-block"
          :class="sidebarNav ? 'sidebar-nav-item' : 'd-lg-none'"
        >
          <b-link
            v-if="!item.divider"
            v-b-toggle.menu
            :to="item.to"
            :href="item.href"
            :data-qa="item.dataQa"
            class="nav-link"
          >
            <span :class="renderIcon(item.name)" />
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
          @click.prevent="login"
        >
          <span :class="renderIcon('/account/login')" />
          <span>
            {{ $t('account.linkLoginJoin') }}
          </span>
        </b-link>
      </li>
    </template>
  </b-navbar-nav>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import login from '../mixins/login';

  export default {
    components: {
      SmartLink
    },
    mixins: [
      login
    ],
    props: {
      links: {
        type: Array,
        default: () => []
      },
      sidebarNav: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const keycloakAccountUrl = `${this.$auth.strategy.options.origin}/auth/realms/${this.$auth.strategy.options.realm}/account?referrer=${this.$auth.strategy.options.client_id}`;

      return {
        authLinks: [
          { to: this.$path({ name: 'account' }), text: this.$t('account.myProfile'), name: '/account', dataQa: 'likes and galleries button' },
          { href: keycloakAccountUrl, text: this.$t('account.profileSettings'), name: '/account/settings', dataQa: 'account settings button' },
          { divider: true, name: 'divider' },
          { to: { name: 'account-logout' }, text: this.$t('account.linkLogout'), name: '/account/logout', dataQa: 'log out button' }
        ]
      };
    },

    computed: {
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
      renderIcon(name) {
        let className = '';
        switch (name) {
        case ('/'):
          className = 'icon-home';
          break;
        case ('/collections'):
          className = 'icon-collections';
          break;
        case ('/europeana-classroom'):
          className = 'icon-school';
          break;
        case ('/about-us'):
          className = 'icon-info';
          break;
        case ('/help'):
          className = 'icon-help';
          break;
        case ('/account'):
          className = 'icon-account';
          break;
        case ('/account/login'):
          className = 'icon-login';
          break;
        case ('/account/logout'):
          className = 'icon-logout';
          break;
        case ('/account/settings'):
          className = 'icon-settings';
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
  @import '../assets/scss/variables.scss';
  @import '../assets/scss/icons.scss';

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

      &:hover {
        color: $innovationblue;
      }

      &.exact-active-link {
        &:after {
          content: '';
          position: absolute;
          border-bottom: solid 3px $blue;
          display: block;
          width: 100%;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: calc(-0.6rem);
        }
      }

      &.is-external-link:after {
        @extend .icon-font;
        content: '\e900';
      }

      .nav-link-icon {
        display: inline-block;
        font-size: 1rem;
        z-index: 1;
        margin-right: 0.75rem;
        &:before {
          @extend .icon-font;
          content: '';
          color: $black;
          transition: $standard-transition;
          font-size: 1.5rem;
        }
        &.icon-home:before {
          content: '\e922';
        }
        &.icon-collections:before {
          content: '\e91d';
        }
        &.icon-school:before {
          content: '\e91e';
        }
        &.icon-info:before {
          content: '\e91f';
        }
        &.icon-help:before {
          content: '\e921';
        }
        &.icon-login:before {
          content: '\e926';
        }
        &.icon-logout:before {
          content: '\e927';
        }
        &.icon-settings:before {
          content: '\e928';
        }
        &.icon-account:before {
          content: '\e932';
        }
        &.blank:before {
          color: transparent;
        }
      }

    }

    &.sidebar-nav-item {
      width: 100%;
      margin: 0 0 0.25rem 0;
      position: relative;
      margin-right: 0;
      &:nth-last-child(2) {
        margin-right: 0;
      }
      &:first-of-type, &:last-of-type {
        display: block;
      }
      .nav-link {
        text-transform: capitalize;
        font-weight: 400;
        border-radius: $border-radius-small;
        transition: $standard-transition;
        font-size: $font-size-base;

        &.exact-active-link, &:hover {
          color: $white;
          background: $blue;
          &:before, &:after {
            display: none;
          }
          .nav-link-icon:before {
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

    @media (min-width: $bp-large) {
      &:not(.sidebar-nav-item) {
        width: auto;
        margin: auto;

        .nav-link {
          text-transform: uppercase;
          font-size: $font-size-small;
          font-weight: 600;
          span {
            position: relative;
          }
          .nav-link-icon {
            display: none;
          }
        }
      }
    }
  }

</style>
