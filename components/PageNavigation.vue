<template>
  <b-container class="p-0">
    <b-nav>
      <b-nav-item
        v-for="nav in navigation"
        :key="nav.name"
        :to="localePath(nav.path)"
        exact
        exact-active-class="active"
        variant="secondary"
      >
        {{ nav.name }}
      </b-nav-item>
    </b-nav>
  </b-container>
</template>

<script>
  export default {
    computed: {
      navigation() {
        return this.$store.state.navigation.data;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .nav-link {
    color: $darkgrey;

    &.active {
      font-weight: bold;
    }
  }
</style>
