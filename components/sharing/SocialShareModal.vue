<template>
  <b-modal
    id="shareModal"
    title="Share"
    hide-header-close
    hide-footer
  >
    <div class="icon-wrapper">
      <SocialShare
        :media-url="mediaUrl"
        with-text
      />
    </div>
    <b-button
      variant="outline-primary"
      class="mt-5"
      @click="$bvModal.hide('shareModal')"
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
  @import '../../assets/scss/variables.scss';

  #shareModal {
    .modal-dialog {
      max-width: 560px;
      margin-top: 10rem;
    }
    .modal-content {
      border: none;
      .modal-header {
        border-bottom: none;
        padding: 1.5rem 1.5rem 0 1.5rem;
      }
      .modal-title {
        font-size: 2.125rem;
        font-weight: 600;
      }
      .modal-body {
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        .icon-wrapper > div {
          display: flex;
          justify-content: space-between;
        }
        a {
          border-radius: 0.25rem;
          width: calc(100% / 3 - 10px);
          height: 3rem;
          margin-right: 0 !important;
          &.facebook {
            border: solid 1px #4064ac;
            span {
              color: #4064ac;
            }
          }
          &.twitter {
            border: solid 1px #1c9ceb;
            span {
              color: #1c9ceb;
            }
          }
          &.pinterest {
            border: solid 1px #ba0a21;
            span {
              color: #ba0a21;
            }
          }
          &:hover {
            background: $white;
          }
          span.text {
            font-family: $font-family-sans-serif;
            font-weight: 600;
            padding-left: 0.75rem;
          }
        }
        button {
          font-weight: 600;
        }
      }
    }
  }

  #shareModal + .modal-backdrop {
    opacity: 0.7;
  }

</style>
