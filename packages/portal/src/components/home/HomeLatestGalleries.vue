<template>
  <BrowseAutomatedCardGroup
    section-type="Latest galleries"
    :more-button="moreButton"
  />
</template>

<script>
  import BrowseAutomatedCardGroup from '@/components/browse/BrowseAutomatedCardGroup';

  export default {
    name: 'HomeLatestGalleries',

    components: {
      BrowseAutomatedCardGroup
    },

    data() {
      return {
        moreButton: {
          url: '/galleries',
          text: this.$t('galleries.seeAllPublished')
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep {
    .col-12 {
      margin-right: auto;
      margin-left: auto;
    }
  }

</style>
