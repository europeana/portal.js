<template>
  <div
    class="page"
  >
    <div
      class="hero"
    >
      <div
        class="hero-content"
      >
        <SearchForm />
      </div>
    </div>
    <CallToAction
      v-if="topCTA"
      :call-to-action="topCTA"
    />
    <CallToAction
      v-if="middleCTA"
      :call-to-action="middleCTA"
    />
    <CallToAction
      v-if="bottomCTA"
      :call-to-action="bottomCTA"
    />
  </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm';
  import CallToAction from './CallToAction';

  export default {
    name: 'HomePage',

    components: {
      SearchForm,
      CallToAction
    },

    props: {
      callsToAction: {
        type: Array,
        default: () => []
      }
    },

    computed: {
      topCTA() {
        return this.callsToAction.find(cta => cta.position === 'home-top');
      },
      middleCTA() {
        return this.callsToAction.find(cta => cta.position === 'home-middle');
      },
      bottomCTA() {
        return this.callsToAction.find(cta => cta.position === 'home-bottom');
      },
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

  .page {
    align-contet: center;
    background-color: white;
    padding-bottom: 1rem;
  }

</style>
