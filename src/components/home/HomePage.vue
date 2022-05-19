<template>
  <div
    class="hero"
  >
    <div
      class="hero-content"
    >
      <SearchForm />
    </div>
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';

  export default {
    name: 'HomePage',

    components: {
      SearchForm
    }

  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .hero {
    margin-top: -70px;
    background-color: $mediumgrey-light;
    padding: 12rem 1.5rem;
    min-height: 100vh;

    @media (min-width: $bp-medium) {
      font-size: 2vw;
      padding: 6em 0 3em;
    }
  }

  .hero-content {
    margin: 0 auto;

    @media (min-width: $bp-medium) {
      width: 25em;
      min-width: 644px;
    }
  }

</style>
