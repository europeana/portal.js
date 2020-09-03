<template>
  <b-navbar-nav
    class="ml-xl-auto"
    data-qa="main navigation"
  >
    <li
      v-for="(link, index) in links"
      :key="index"
      class="nav-item"
    >
      <SmartLink
        v-b-toggle.menu
        :destination="link.url"
        link-class="nav-link"
        exact
      >
        <span>
          <i :class="renderIcon(link.url)" />
          {{ link.text }}
        </span>
      </SmartLink>
    </li>
    <!-- sso links -->
    <template v-if="enableAuthLinks">
      <li
        v-if="isAuthenticated"
        class="nav-item d-none d-lg-inline-block"
      >
        <b-dropdown
          right
          no-caret
          variant="white"
          class="nav-link"
          :class="isAccountPage && 'exact-active-link'"
        >
          <template
            slot="button-content"
          >
            <span class="label">{{ $t('account.linkAccount') }}</span>
          </template>
          <template v-for="(item, index) in authLinks">
            <b-dropdown-divider
              v-if="item.divider"
              :key="index"
            />
            <b-dropdown-item
              v-else
              :key="index"
              :to="item.to"
              :href="item.href"
            >
              <span class="label">{{ item.text }}</span>
            </b-dropdown-item>
          </template>
        </b-dropdown>
      </li>
      <template v-if="isAuthenticated">
        <li
          v-for="item in authLinks"
          :key="item.name"
          class="nav-item d-block d-lg-none"
        >
          <b-link
            v-if="!item.divider"
            v-b-toggle.menu
            :to="item.to"
            :href="item.href"
            class="nav-link"
          >
            <span>
              <i :class="renderIcon(item.name)" />
              {{ item.text }}
            </span>
          </b-link>
        </li>
      </template>
      <li
        v-else-if="enableLoginLink"
        class="nav-item"
      >
        <b-link
          v-b-toggle.menu
          data-qa="login button"
          class="nav-link"
          :to="{ name: 'account-login' }"
        >
          <span>
            <i :class="renderIcon('/account/login')" />
            {{ $t('account.linkLogin') }}
          </span>
        </b-link>
      </li>
    </template>
  </b-navbar-nav>
</template>

<script>
  import SmartLink from './generic/SmartLink';

  export default {
    components: {
      SmartLink
    },
    props: {
      links: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        authLinks: [
          { to: this.$path({ name: 'account' }), text: this.$t('account.profile'), name: '/account' },
          { href: `${process.env.OAUTH_ORIGIN}/auth/realms/${process.env.OAUTH_REALM}/account?referrer=${process.env.OAUTH_CLIENT}`, text: this.$t('account.settings'), name: '/account/settings' },
          { divider: true, name: 'divider' },
          { to: { name: 'account-logout' }, text: this.$t('account.linkLogout'), name: '/account/logout' }
        ]
      };
    },
    computed: {
      enableLoginLink() {
        return Boolean(Number(process.env.ENABLE_LOGIN_LINK));
      },
      enableAuthLinks() {
        return Boolean(Number(process.env.ENABLE_XX_USER_AUTH));
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
          className = 'icon-favorite';
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
        return className;
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
          bottom: -0.6rem;
        }
      }

      &.is-external-link:after {
        @extend .icon-font;
        content: '\e900';
      }

      span {
        display: flex;
        align-items: center;
        i {
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
          &.icon-favorite:before {
            content: '\e92c';
          }
          &.blank:before {
            color: transparent;
          }
        }
      }
    }

    @media (max-width: $bp-large) {
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
          i:before {
            color: $white;
          }
        }
      }
    }

    @media (min-width: $bp-large) {
      width: auto;
      margin: auto;

      .nav-link {
        text-transform: uppercase;
        font-size: $font-size-small;
        font-weight: 600;
        span {
          position: relative;
          i {
            display: none;
          }
        }
      }
    }
  }

  ::v-deep .dropdown {
    &.nav-link {
      padding: 1px 0;
    }
    .label {
      color: $mediumgrey;
      font-size: $font-size-small;
      font-weight: 600;
      text-decoration: none;
      text-transform: uppercase;
    }
    &-divider {
      margin: 0;
    }
    &-menu {
      margin-top: 0.65rem;
      border-radius: 0.25rem;
      box-shadow: $boxshadow-light;
      border: solid 1px $paper;
      li a {
        padding: 0.85rem 1rem;
        transition: $standard-transition;
        &:hover {
          background-color: $offwhite;
        }
      }
    }
  }
</style>
