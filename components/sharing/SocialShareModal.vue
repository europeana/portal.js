<template>
  <b-modal
    id="shareModal"
    title="Share"
    hide-header-close
    hide-footer
    data-qa="share modal"
  >
    <div class="icon-wrapper">
      <SocialShare
        :media-url="mediaUrl"
        with-text
      />
    </div>
    <b-form
      @submit.stop.prevent="submitForm"
    >
      <b-form-textarea
        id="shareEmbed"
        readonly
      />
      <b-button
        variant="outline-secondary"
      >
        {{ $t('actions.copy') }}
      </b-button>
    </b-form>
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
    .modal-content {
      .modal-body {
        .icon-wrapper > div {
          display: flex;
          justify-content: space-between;
        }
        a {
          border-radius: 0.25rem;
          width: calc(100% / 3 - 10px);
          height: 3rem;
          margin-right: 0 !important;
          justify-content: flex-start;
          padding-left: 1rem;
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
        @media (max-width: $bp-small) {
          .icon-wrapper > div {
            flex-direction: column;
            a {
              width: 100%;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }

</style>
