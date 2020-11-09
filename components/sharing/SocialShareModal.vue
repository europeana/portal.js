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
      v-if="oEmbedDataHtml"
      class="mt-3"
      @submit.stop.prevent="submitForm"
    >
      <b-form-textarea
        id="shareEmbed"
        ref="shareEmbed"
        v-model="oEmbedDataHtml"
        readonly
      />
      <b-button
        class="mt-1 copy-button"
        @click="copyEmbedCode"
      >
        {{ $t('actions.copy') }}
      </b-button>
      <span
        :class="{active: isActive}"
        class="copy-to-clipboard-success"
      >
        <span class="icon-check_circle d-inline-flex pr-1" />
        {{ $t('messages.copyToClipboardSuccess') }}
      </span>
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
  import { oEmbedForEndpoint } from '../../plugins/oembed';

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
    },

    data() {
      return {
        oEmbedDataHtml: null,
        isActive: false
      };
    },

    created() {
      oEmbedForEndpoint(process.env.OEMBED_ENDPOINT || 'https://oembedjs.europeana.eu/',
                        process.env.PORTAL_BASE_URL + this.$route.path || `https://www.europeana.eu${this.$route.path}`)
        .then((response) => {
          if (response.data.html) {
            this.oEmbedDataHtml = response.data.html;
          }
        });
    },

    methods: {
      copyEmbedCode() {
        let textarea = this.$refs.shareEmbed;
        textarea.select(); // select the text area
        document.execCommand('copy');
        this.isActive = true;
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
        .copy-button {
          text-transform: capitalize;
          background: $offwhite;
          color: $mediumgrey;
          font-size: $font-size-small;
          border-color: transparent;
          box-shadow: none;
          border-radius: 0.25rem;
          padding: 0.375rem 0.5rem;
          &:hover {
            box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
          }
        }
        .copy-to-clipboard-success {
          display: none;
          vertical-align: middle;
          margin-left: 0.5rem;
          font-size: $font-size-small;
          &.active {
            display: inline-flex;
            align-items: center;
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
