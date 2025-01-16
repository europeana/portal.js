<!--
  This is a dummy component for Klaro which serves only to load the JS & CSS when
  needed.
-->
<template>
  <div>
    <script
      :src="klaroHeadScript.src"
      :defer="klaroHeadScript.defer"
    /></script>
  </div>
</template>

<script>
  import klaroMixin from '@/mixins/klaro.js';

  export default {
    name: 'PageCookieConsent',

    mixins: [
      klaroMixin
    ]
  };
</script>

<style lang="scss">
  @import 'https://cdn.jsdelivr.net/npm/klaro@0.7.18/dist/klaro.min.css';
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/klaro';
</style>
