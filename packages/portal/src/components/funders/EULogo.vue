<template>
  <img
    width="304"
    height="64"
    :src="localisedEULogo"
    :alt="$t('footer.imageDescription')"
    class="eu-logo"
  >
</template>
<script>
  export default {
    name: 'EULogo',

    computed: {
      localisedEULogo() {
        let logo;
        try {
          logo = require(`@/assets/img/eu-funded/${this.$i18n.locale}-Funded by the EU_NEG.svg`);
        } catch (e) {
          logo = require('@/assets/img/eu-funded/en-Funded by the EU_NEG.svg');
        }
        return logo;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .bottom-right {
    position: absolute;
    bottom: 0;
    max-width: calc(100vw - 95px - 3rem); // viewport width minus cutout (95px) and 1rem for extra spacing

    --right-spacing: calc(64 / 304 * 50%); // 50% of height divided by width to get 50% height of img for right spacing

    @media (max-width: $bp-small - 1px) {
      margin-bottom: 1rem;
      margin-left: 1rem;
      right: calc(95px + 1rem); // keep space for cutout (95px) and 1rem for extra spacing
    }

    @media (min-width: $bp-small) {
      right: 0;
      transform: translate(calc(-95px - var(--right-spacing)), -50%); // spacing of 50% of img height and the cutout
    }

    @media (min-width: $bp-xxxl) {
      transform: translate(calc((95 / 16 * -1vw) - var(--right-spacing)), -50%); // adjust for responsive cutout
    }
  }

  img {
    @media (min-width: $bp-4k) {
      width: 456px;
      height: auto;
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
