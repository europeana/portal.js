<template>
  <img
    height="64"
    :src="localisedEULogo"
    :alt="$t('footer.imageDescription')"
    class="eu-logo"
  >
</template>

<script>
  export default {
    name: 'ImageEULogo',

    computed: {
      localisedEULogo() {
        let logo;
        try {
          logo = require(`@europeana/style/img/eu-funded/${this.$i18n.locale}-Funded by the EU_NEG.svg`);
        } catch (e) {
          logo = require('@europeana/style/img/eu-funded/en-Funded by the EU_NEG.svg');
        }
        return logo;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  img {
    @media (min-width: $bp-4k) {
      height: 96px;
    }

    &.bottom-right {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      max-width: calc(100vw - 5rem); // viewport width minus space for image attribution icon
      height: auto; // image shrinks on mobile so height is not fixed
      max-height: 64px;

      @media (min-width: $bp-small) {
        left: 1rem;
        margin-left: auto;
        margin-right: auto;
      }

      @media (min-width: $bp-4k) {
        max-height: 96px;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #000; margin: -16px; padding: 16px;">
      <EULogo />
    </div>
  ```
</docs>
