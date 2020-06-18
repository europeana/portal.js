<template>
  <b-navbar-nav
    class="ml-xl-auto"
    data-qa="main navigation"
  >
    <li
      v-for="(nav, index) in navigation"
      :key="index"
      class="nav-item"
    >
      <SmartLink
        v-b-toggle.menu
        :destination="nav.url"
        link-class="nav-link"
      >
        <span>
          <i :class="renderIcon(nav.url)" />
          {{ nav.text }}
        </span>
      </SmartLink>
    </li>
    <!-- sso links -->
    <template>
      <li
        v-if="!isAuthenticated"
        class="nav-item"
      >
        <b-link
          class="nav-link"
          @click="login()"
        >
          <span>{{ $t('account.linkLogin') }}</span>
        </b-link>
      </li>
      <li
        v-else
        class="nav-item"
      >
        <b-link
          href="/account/profile"
          class="nav-link"
        >
          <span>{{ $t('account.linkAccount') }}</span>
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

    computed: {
      navigation() {
        return this.$store.state['link-group'].data.mobileNavigation.links;
      },

      i18n() {
        return this.$store.state.i18n.locale;
      },
      enableAuthLinks() {
        return Boolean(Number(process.env.ENABLE_XX_USER_AUTH));
      },
      isAuthenticated() {
        return this.$store.state.auth.loggedIn;
      }
    },
    watch: {
      i18n() {
        this.getNavigationData();
      }
    },
    methods: {
      async login() {

        await this.$auth.loginWith('keycloak');
      },
      async getNavigationData() {
        return this.$store.dispatch('link-group/init');
      },

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
        }
        return className;
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
          bottom: -0.8rem;
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

      &:first-of-type, &:nth-last-child(2) {
        display: none;
      }

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
</style>
