<template>
  <b-navbar
    class="navbar border-bottom py-0"
    data-qa="main navigation"
  >
    <b-container class="p-0">
      <b-navbar-nav class="px-2">
        <li
          v-for="nav in navigation"
          :key="nav.text"
          class="nav-item"
        >
          <SmartLink
            :destination="nav.url"
            link-class="nav-link"
            exact-active-class="font-weight-bold"
          >
            {{ nav.text }}
          </SmartLink>
        </li>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
  import SmartLink from './generic/SmartLink';

  export default {
    components: {
      SmartLink
    },

    computed: {
      navigation() {
        return this.$store.state['link-group'].links.mainNavigation;
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

  .nav-item:not(:last-child) {
    margin-right: 1rem;
  }

  .navbar-nav .nav-link {
    color: $darkgrey;
  }
</style>
