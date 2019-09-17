<template>
  <b-navbar
    class="navigation-container"
    data-qa="main navigation"
  >
    <b-container class="p-0">
      <b-navbar-nav>
        <b-nav-item
          v-for="nav in navigation"
          :key="nav.name"
          :to="localePath(nav.path)"
          active-class="font-weight-bold"
          variant="secondary"
          data-qa="main navigation link"
        >
          {{ nav.name }}
        </b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
  export default {
    computed: {
      navigation() {
        return this.$store.state.navigation.data;
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

    mounted() {
      this.getNavigationData();
    },

    methods: {
      async getNavigationData() {
        return this.$store.dispatch('navigation/init');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .navigation-container {
    background: $bodygrey;
    padding-top: 0;
    padding-bottom: 0;
  }

  .navbar-light {
    .navbar-nav {
      .nav-link {
        color: $darkgrey;
      }
    }
  }
</style>
