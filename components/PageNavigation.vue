<template>
  <b-navbar-nav
    class="d-flex justify-content-around align-items-center ml-xl-auto"
    data-qa="main navigation"
  >
    <li class="nav-item d-md-block d-lg-none">
      <SmartLink
        :destination="{ name: 'index' }"
        link-class="nav-link"
        aria-label="Europeana home"
      >
        <span class="icon-split icon d-block d-lg-none" />
      </SmartLink>
    </li>
    <li
      v-for="(nav, index) in navigation"
      :key="index"
      class="nav-item"
    >
      <SmartLink
        :destination="nav.url"
        link-class="nav-link"
      >
        <span class="d-none d-lg-block">{{ nav.text }}</span>
        <span
          :class="getIcon(nav.text) + ' icon d-block d-lg-none'"
          :aria-labelledby="nav.text"
        />
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
      getIcon(item) {
        switch (item) {
        case 'Collections':
          return 'icon-collections';
        case 'Teachers':
          return 'icon-school';
        case 'About us':
          return 'icon-info';
        default:
          return 'icon-info'; // what should default icon be?
        }
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
          bottom: -1rem;
        }
        span.icon:before{
          color: $blue;
        }
      }

      &.is-external-link:after {
        @extend .icon-font;
        /* content: '\e900'; */
      }

      span {
        position: relative;
        &.icon{
          &:before{
            transition: $standard-transition;
            font-size: $font-size-large;
            color: $slategrey;
          }
          @extend .icon-font;
          &.icon-split:before {
            content: "\e920";
          }
          &.icon-collections:before {
            content: "\e91d";
          }
          &.icon-school:before {
            content: "\e91e";
          }
          &.icon-info:before {
            content: "\e91f";
          }
        }
      }
    }

    &:last-child {
      .nav-link {
        padding-right: 0;
        &.nuxt-link-active:after {
          left: 0.25rem;
        }
        &:before {
          right: -0.5rem;
        }
      }
    }
    @media (max-width: $bp-large){
      &:not(:last-child) {
        margin-right: 0;
      }
      .nav-link {
        &.nuxt-link-active:after {
          display: none;
        }
      }
    }
  }
</style>
