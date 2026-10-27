<template>
  <b-container
    class="person-section-container"
  >
    <PersonSection
      :title="section.headline"
      :description="section.text"
      :people="section.hasPartCollection?.items.filter(Boolean)"
    />
  </b-container>
</template>
<script>
  export default {
    name: 'LandingPersonSection',

    components: {
      PersonSection: () => import('@/components/person/PersonSection')
    },

    props: {
      section: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .person-section-container {
    margin-bottom: 3rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-medium) {
    }

    @media (min-width: $bp-large) {
      max-width: 1250px;
    }

    @media (min-width: $bp-4k) {
      max-width: 2500px;
    }
  }
</style>
