<template>
  <nav
    class="navigation-container"
    data-qa="main navigation"
  >
    <b-container class="p-0">
      <b-nav>
        <b-nav-item
          v-for="nav in navigation"
          :key="nav.name"
          :to="localePath(nav.path)"
          exact
          exact-active-class="font-weight-bold"
          variant="secondary"
          data-qa="main navigation link"
        >
          {{ nav.name }}
        </b-nav-item>
      </b-nav>
    </b-container>
  </nav>
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
  }

  .nav-link {
    color: $darkgrey;
  }
</style>
