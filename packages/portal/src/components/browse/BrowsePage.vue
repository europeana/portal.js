<template>
  <div
    data-qa="browse page"
    class="page white-page xxl-page"
  >
    <slot />
    <b-container>
      <ContentHeader
        :title="name"
        :description="headline"
        :media-url="socialMediaImageUrl"
        button-variant="secondary"
        class="half-col"
      />
      <BrowseSections
        :sections="hasPartCollection.items"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../generic/ContentHeader';
  import BrowseSections from './BrowseSections';

  export default {
    components: {
      ContentHeader,
      BrowseSections
    },
    props: {
      name: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      hasPartCollection: {
        type: Object,
        default: null
      },
      socialMediaImageUrl: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.page {
  padding-bottom: 1rem;
  padding-top: 1rem;
  margin-top: -1rem;

  @media (min-width: $bp-4k) {
    padding-bottom: 1.5rem;
    padding-top: 1.5rem;
    margin-top: -1.5rem;
  }
}
</style>
