<template>
  <div>
    <div
      class="position-relative"
    >
      <b-button
        class="copy-button"
        @click="copySnippet"
        @keydown.enter="copySnippet"
      >
        {{ buttonText }}
      </b-button>
      <component
        :is="tag"
        class="snippet"
      >
        {{ text }}
      </component>
    </div>
    <output
      :class="snippetCopied ? 'd-inline-flex' : 'visually-hidden'"
      class="copy-to-clipboard-success align-items-center mb-1"
    >
      <span class="icon-check-circle d-inline-block mr-1" />
      {{ $t('messages.copyToClipboardSuccess') }}
    </output>
    <p class="help d-flex align-items-center">
      <span class="icon-info-outline d-inline-block mr-1" />
      {{ helpText }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'ItemSnippetCopyButton',

    props: {
      tag: {
        type: String,
        default: 'span'
      },
      text: {
        type: String,
        default: null
      },
      buttonText: {
        type: String,
        default: null
      },
      helpText: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        snippetCopied: false
      };
    },

    methods: {
      async copySnippet() {
        try {
          await navigator.clipboard.writeText(this.text);
        } catch {
          // don't worry
        }
        this.snippetCopied = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .snippet {
    color: $mediumgrey;
    background: $whitegrey;
    border-radius: 6px;
    padding: 0.75rem;
    word-wrap: break-word;
    font-size: $font-size-small;
    overflow-y: auto !important;
    display: inline-block;
    margin: 0;
    max-width: 100%;
    box-shadow: inset 0 0 0 1px transparent;
    transition: box-shadow $standard-transition;
  }

  code.snippet {
    font-size: $font-size-extrasmall;
  }

  .copy-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;

    &:hover + .snippet {
      box-shadow: inset 0 0 0 1px $blue;
      transition: box-shadow $standard-transition;
    }
  }

  .copy-to-clipboard-success {
    font-size: $font-size-small;
  }

  .help {
    font-size: $font-size-extrasmall;
    color: $mediumgrey;
    margin-bottom: 1.25rem;

    .icon-info-outline {
      font-size: $font-size-small;
    }
  }
</style>
