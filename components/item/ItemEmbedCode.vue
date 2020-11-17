<template>
  <b-form
    data-qa="share modal embed"
    class="mt-3"
    @submit.stop.prevent="submitForm"
  >
    <label for="shareEmbed">{{ $t('record.copyEmbedLabel') }}</label>
    <b-form-textarea
      id="shareEmbed"
      ref="shareEmbed"
      v-model="embedHtml"
      readonly
      tabindex="0"
      data-qa="share modal embed textarea"
      @click="copyEmbedCode"
      @keydown="copyEmbedCode"
    />
    <span
      :class="{active: embedCopied}"
      class="copy-to-clipboard-success"
      data-qa="share modal copied notice"
    >
      <span class="icon-check_circle d-inline-flex pr-1" />
      {{ $t('messages.copyToClipboardSuccess') }}
    </span>
  </b-form>
</template>

<script>

  export default {
    name: 'ItemEmbedCode',

    props: {
      embedHtml: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        embedCopied: false
      };
    },

    methods: {
      copyEmbedCode(event) {
        if (event.type === 'click' || event.keyCode === 13) {
          let textarea = this.$refs.shareEmbed;
          textarea.select();
          document.execCommand('copy');
          this.embedCopied = true;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../../assets/scss/variables.scss';

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
</style>
