<template>
  <div
    class="hero"
  >
    <h1
      class="text-center"
    >
      {{ $t('homePage.title') }}
    </h1>
    <div
      class="hero-content"
    >
      <h2 class="text-center">
        {{ $t('homePage.subHeadline') }}
      </h2>
      <SearchForm />
    </div>
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';

  export default {
    name: 'HomeHero',

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

    h1,
    h2 {
      color: $white;
    }

    h1 {
      font-size: 2.125rem;
      font-weight: 700;
      margin-bottom: 1.8em;
    }

    h2 {
      font-size: 1rem;
      margin-bottom: 3em;
    }

    @media (min-width: $bp-extralarge) {
      padding: 6em 0 3em;
      font-size: 2vw;

      h1 {
        font-size: 1.5em;
      }

      h2 {
        font-size: 0.875em;
      }
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

<docs lang="md">
  ```jsx
    <HomeHero />
  ```
</docs>
