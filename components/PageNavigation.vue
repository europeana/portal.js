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
        :destination="link.url"
        link-class="nav-link"
      >
        <span>{{ link.text }}</span>
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

    props: {
      links: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      i18n() {
        return this.$store.state.i18n.locale;
      }
    },

    watch: {
      // FIXME: broken with removal of link-group store module; refactor
      i18n() {
        // this.getNavigationData();
      }
    },

    methods: {
      // async getNavigationData() {
      //   return this.$store.dispatch('link-group/init');
      // }
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
      .nav-link.nuxt-link-active {
        &:after {
          bottom: -1rem;
        }
      }
    }
  }
</style>
