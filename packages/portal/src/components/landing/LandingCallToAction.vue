<template>
  <b-container>
    <ContentPrimaryCallToAction
      :text="text"
      :link="link"
    />
  </b-container>
</template>

<script>
  import ContentPrimaryCallToAction from '@/components/content/ContentPrimaryCallToAction';
  export default {
    name: 'LandingCallToAction',

    components: {
      ContentPrimaryCallToAction
    },

    props: {
      /**
       * Text to display under title and above the info cards
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Link Object
       */
      link: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container {
    padding-top: 3.75rem;
    padding-bottom: 2rem;

    @media (min-width: $bp-medium) {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }

    .primary-cta {
      margin-left: auto !important;
      margin-right: auto !important;

      @media (min-width: $bp-large) {
        width: 100% !important;
        max-width: 960px;
      }
    }
  }
</style>
