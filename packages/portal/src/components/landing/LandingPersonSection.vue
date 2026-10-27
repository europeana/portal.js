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

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .person-section-container {
    margin-bottom: 3rem;
    margin-left: auto;
    margin-right: auto;

    ::v-deep .person-card,
    ::v-deep .person-section {
      --bp-4k-increment: 2;
    }
  }
</style>
