<template>
  <img
    width="304"
    height="64"
    :src="EULogo"
    class="mb-3"
    :alt="$t('footer.imageDescription')"
  >
</template>
<script>
  export default {
    name: 'EULogo',

    computed: {
      EULogo() {
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

<docs lang="md">
  ```jsx
    <div style="background-color: #000000; margin: -16px; padding: 16px;">
      <EULogo />
    </div>
  ```
</docs>
