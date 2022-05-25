<template>
  <div>
    <HomeHero />
    <HomeLatest />
  </div>
</template>

<script>
  import HomeHero from './HomeHero';
  import HomeLatest from './HomeLatest';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      HomeLatest
    }
  };

</script>
