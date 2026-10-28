<template>
  <b-container class="person-section-container">
    <PersonSection
      :title="section.headline"
      :title-tag="titleTag"
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
      },
      /**
       * Heading title level to use. Override default for when used in subsection to keep correct heading structure.
       */
      titleTag: {
        type: String,
        default: 'h2'
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.person-section-container {
  --bp-4k-increment: 2;

  margin-top: 1.5rem;
  margin-bottom: 3rem;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1.5rem;

  @media (min-width: $bp-large) {
    margin-top: 3rem;
    padding-top: 3rem;
  }

  @media (min-width: $bp-4k) {
    margin-top: calc(var(--bp-4k-increment) * 3rem);
    padding-top: calc(var(--bp-4k-increment) * 3rem);
  }

  @at-root .landing-sub-section & {
    margin-top: 0;
    padding-top: 0;
  }

  ::v-deep .person-card,
  ::v-deep .person-section {
    --bp-4k-increment: 2;
  }

  ::v-deep .section-header {
    @media (min-width: $bp-large) {
      margin-bottom: 3rem;
    }

    @media (min-width: $bp-4k) {
      margin-bottom: calc(var(--bp-4k-increment) * 3rem);
    }
  }
}
</style>
