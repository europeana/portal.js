<template>
  <div
    class="page"
  >
    <HomeHero />
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
  import HomeHero from '@/components/home/HomeHero';
  import CallToAction from './CallToAction';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
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
  .page {
    align-contet: center;
    background-color: white;
    padding-bottom: 1rem;
  }
</style>
