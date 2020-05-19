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
        console.log(this.$store.state['link-group'].data);
        return this.$store.state['link-group'].data.mainNavigation.links;
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
        case ('Collections'):
          className = 'icon-collections';
          break;
        case ('Teachers'):
          className = 'icon-school';
          break;
        case ('About us'):
          className = 'icon-info';
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
    &:not(:last-child) {
      margin-right: 1rem;
    }

    .nav-link {
      color: $mediumgrey;
      text-decoration: none;
      text-transform: uppercase;
      font-size: $font-size-small;
      font-weight: 600;

      &.nuxt-link-active {
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
        i{
          display: none;
          :before {
            @extend .icon-font;
            content: '';
            color: $black;
            font-size: 1.5rem;
          }
        }
      }
    }

    &:last-child {
      .nav-link {
        &.nuxt-link-active:after {
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
      &:not(:last-child) {
        margin-right: 0rem;
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
            transition: $standard-transition;
            &.icon-collections:before {
              content: '\e91d';
            }
            &.icon-school:before {
              content: '\e91e';
            }
            &.icon-info:before {
              content: '\e91f';
            }
          }
        }
        &.nuxt-link-active, &:hover {
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
