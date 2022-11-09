<template>
  <b-modal
    id="share-modal"
    :title="$t('actions.share')"
    hide-header-close
    hide-footer
    data-qa="share modal"
  >
    <div class="icon-wrapper">
      <SocialShare
        :media-url="mediaUrl"
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
      mediaUrl: {
        type: String,
        default: null
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
