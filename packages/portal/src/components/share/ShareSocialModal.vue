<template>
  <b-modal
    id="share-modal"
    :title="$t('actions.share')"
    hide-header-close
    hide-footer
    data-qa="share modal"
    title-tag="h2"
    header-tag="div"
    @show="$emit('show')"
  >
    <p>{{ $t('shareWhere') }}</p>
    <div class="icon-wrapper pt-1 mb-4">
      <ShareSocialButton
        :media-url="mediaUrl"
        :share-to="shareTo"
      />
    </div>
    <slot />
    <b-button
      variant="outline-primary"
      @click="$bvModal.hide('share-modal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  import ShareSocialButton from './ShareSocialButton';

  export default {
    name: 'ShareSocialModal',

    components: {
      ShareSocialButton
    },

    props: {
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
  @import '@europeana/style/scss/variables';

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
