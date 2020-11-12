<template>
  <b-modal
    id="shareModal"
    title="Share"
    hide-header-close
    hide-footer
    data-qa="share modal"
    @hide="resetEmbedCopied"
    v-on="{ show: onItemPage ? requestEmbed : null}"
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
      <label> {{ $t('record.copyEmbedLabel') }}</label>
      <b-form-textarea
        id="shareEmbed"
        ref="shareEmbed"
        v-model="oEmbedDataHtml"
        readonly
        tabindex="0"
        @click="copyEmbedCode"
        @keydown="copyEmbedCode"
      />
      <span
        :class="{active: embedCopied}"
        class="copy-to-clipboard-success"
      >
        <span class="icon-check_circle d-inline-flex pr-1" />
        {{ $t('messages.copyToClipboardSuccess') }}
      </span>
    </b-form>
    <b-button
      variant="outline-primary"
      class="mt-4"
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
      },
      onItemPage: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        oEmbedDataHtml: null,
        embedCopied: false
      };
    },

    methods: {
      requestEmbed() {
        oEmbedForEndpoint(process.env.OEMBED_ENDPOINT || 'https://oembedjs.europeana.eu/',
                          `https://www.europeana.eu${this.$route.path}`)
          .then((response) => {
            if (response.data.html) {
              this.oEmbedDataHtml = response.data.html;
            }
          });
      },
      copyEmbedCode(event) {
        if (event.type === 'click' || event.keyCode === 13) {
          let textarea = this.$refs.shareEmbed;
          textarea.select(); // select the text area
          document.execCommand('copy');
          this.embedCopied = true;
          setTimeout(() => this.embedCopied = false, 3000);
        }
      },
      resetEmbedCopied() {
        this.embedCopied = false;
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
        #shareEmbed {
          cursor: pointer;
          height: 3.5rem;
          padding: 0.312rem 0.625rem;
          resize: none;
        }
        .copy-to-clipboard-success {
          display: none;
          vertical-align: middle;
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
