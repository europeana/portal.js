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
        :destination="nav.url"
        link-class="nav-link"
      >
        <span>{{ nav.text }}</span>
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

      &.nuxt-link-active {
        font-weight: bold;
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
        padding-right: 0;

        &:before {
          right: -0.5rem;
        }
      }
    }
  }
</style>
