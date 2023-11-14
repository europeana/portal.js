<template>
  <BrowseAutomatedCardGroup
    section-type="Latest galleries"
    :more-button="moreButton"
  />
</template>

<script>
  import BrowseAutomatedCardGroup from '@/components/browse/BrowseAutomatedCardGroup';

  export default {
    name: 'HomeLatestStories',

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
    h2.card-group-title {
      color: $mediumgrey;
      font-size: 2rem;
      font-weight: 400;
      text-align: center;

      @media (min-width: $bp-extralarge) {
        font-size: $font-size-xxl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xxl-4k;
      }
    }

    .col-12 {
      margin-right: auto;
      margin-left: auto;
    }

    .card-deck {
      flex-flow: row wrap;
      margin-top: 1.25rem;
      margin-bottom: 2.25rem;

      @media (min-width: $bp-4k) {
        margin-top: calc( 1.5 * 1.25rem);
        margin-bottom: calc( 1.5 * 2.25rem);
      }

      .content-card.card {
        @media (max-width: ($bp-medium - 1px)) {
          &:last-child {
            margin-bottom: 0;
          }
        }

        @media (min-width: $bp-large) {
          margin-bottom: 0;
        }
      }
    }
  }

</style>
