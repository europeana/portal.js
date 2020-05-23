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
          <i :class="renderIcon(nav.text)" />
          {{ nav.text }}
        </span>
      </SmartLink>
    </li>
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
      }
    },

    watch: {
      i18n() {
        this.getNavigationData();
      }
    },

    methods: {
      async getNavigationData() {
        return this.$store.dispatch('link-group/init');
      },

      renderIcon(name) {
        let className = '';
        switch (name) {
        case ('Home'):
          className = 'icon-home';
          break;
        case ('Collections'):
          className = 'icon-collections';
          break;
        case ('Teachers'):
          className = 'icon-school';
          break;
        case ('About us'):
          className = 'icon-info';
          break;
        case ('Help'):
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

    &:first-of-type, &:last-of-type {
      display: none;
    }
    .nav-link {
      color: $mediumgrey;
      text-decoration: none;
      text-transform: uppercase;
      font-size: $font-size-small;
      font-weight: 600;

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
        position: relative;
        i {
          display: none;
          &:before {
            @extend .icon-font;
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
        span {
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            font-size: 1rem;
            z-index: 1;
            margin-right: 0.75rem;
            &:before {
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
  }
</style>
