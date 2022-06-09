<template>
  <div
    class="hero"
  >
    <div
      class="hero-content"
    >
      <header>
        <h1
          class="text-center"
        >
          {{ $t('homePage.title') }}
        </h1>
        <i18n
          path="homePage.subHeadline"
          tag="p"
          for="homePage.free"
          class="sub-headline text-center"
        >
          <strong>{{ $t('homePage.free') }}</strong>
        </i18n>
      </header>
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
    .sub-headline {
      color: $white;
    }

    h1 {
      font-size: 2.125rem;
      font-weight: 700;
      margin-bottom: 2em;
    }

    .sub-headline {
      font-size: 1rem;
      margin-bottom: 4em;
    }

    @media (min-width: $bp-medium) {
      .sub-headline {
        font-size: 1.25rem;
      }
    }

    @media (min-width: $bp-extraextralarge) {
      padding: 6em 0 3em;
      font-size: 2vw;

      h1 {
        font-size: 2.6vw;
      }

      .sub-headline {
        font-size: 1.5vw;
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
