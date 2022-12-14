<template>
  <b-modal
    id="share-modal"
    :title="$t('actions.share')"
    hide-header-close
    hide-footer
    data-qa="share modal"
    title-tag="h2"
  >
    <p>{{ $t('shareWhere', { page }) }}</p>
    <div class="icon-wrapper pt-1">
      <SocialShare
        :media-url="mediaUrl"
        :share-to="shareTo"
      />
    </div>
    <slot />
    <b-button
      variant="outline-primary"
      class="mt-4"
      @click="$bvModal.hide('share-modal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  import SocialShare from './SocialShare';

  export default {
    name: 'SocialShareModal',

    components: {
      SocialShare
    },

    props: {
      page: {
        type: String,
        default: 'page'
      },
      mediaUrl: {
        type: String,
        default: null
      },
      shareTo: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/variables';

  #share-modal {
    .modal-content {
      .modal-body {
        .icon-wrapper > div {
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: $bp-small) {
          .icon-wrapper > div {
            flex-direction: column;
          }
        }
      }
    }
  }

</style>
