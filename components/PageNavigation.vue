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
        class="nav-item"
      >
        <b-dropdown
          right
          no-caret
          variant="white"
          menu-class="mt-2 py-3"
          class="nav-link"
        >
          <template
            slot="button-content"
          >
            <span class="label">{{ $t('account.linkAccount') }}</span>
          </template>
          <b-dropdown-item
            :to="localePath({ name: 'account' })"
          >
            <span class="label">{{ $t('account.profile') }}</span>
          </b-dropdown-item>
          <b-dropdown-item
            :to="localePath({ name: 'account-profile' })"
          >
            <span class="label">{{ $t('account.settings') }}</span>
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="logout()">
            <span class="label">{{ $t('account.linkLogout') }}</span>
          </b-dropdown-item>
        </b-dropdown>
      </li>
      <li
        v-else
        class="nav-item"
      >
        <b-link
          data-qa="login button"
          class="nav-link"
          :to="{ name: 'account-login' }"
        >
          <span>{{ $t('account.linkLogin') }}</span>
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
    computed: {
      enableAuthLinks() {
        return Boolean(Number(process.env.ENABLE_XX_USER_AUTH));
      },
      isAuthenticated() {
        return this.$store.state.auth.loggedIn;
      }
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
        default:
          className = 'icon-info blank';
          break;
        }
        return className;
      },
      async logout() {
        await this.$auth.logout();
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
          &.blank:before {
            color: transparent;
          }
        }
      }
    }

    &:last-child {
      .nav-link {
        &.exact-active-link:after {
          left: 0.25rem;
        }
        &:before {
          right: -0.5rem;
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

  .dropdown.nav-link {
    padding: 1px 0 1px 0;
  }

  .dropdown button .label {
    color: $mediumgrey;
    font-size: $font-size-small;
    font-weight: 600;
    text-transform: uppercase;
  }

  .dropdown-menu li {
    &:first-child {
      padding-bottom: 0.7rem;
    }
  }

  .dropdown-item .label {
    text-decoration: none;
    text-transform: uppercase;
    font-size: $font-size-small;
  }
</style>
