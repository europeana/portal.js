<template>
  <div v-if="text">
    <div
      class="snippet-wrapper position-relative mb-1"
    >
      <b-button
        class="copy-button visually-hidden"
        @click="copySnippet"
      >
        {{ buttonText }}
      </b-button>
      <component
        :is="tag"
        data-qa="item snippet copy button"
        class="snippet"
        @click="copySnippet"
      >
        {{ text }}
      </component>
    </div>
    <output
      :class="snippetCopied ? 'd-inline-flex' : 'visually-hidden'"
      class="copy-to-clipboard-success align-items-center mb-1"
      data-qa="item snippet copied message"
    >
      <span class="icon-check-circle d-inline-block mr-1" />
      {{ $t('messages.copyToClipboardSuccess') }}
    </output>
    <p
      v-if="helpText"
      class="help d-flex align-items-center"
    >
      <span class="icon-info-outline d-inline-block mr-1" />
      {{ helpText }}
    </p>
  </div>
</template>

<script>
  export default {
    name: 'ItemSnippetCopyButton',

    props: {
      /**
       * HTML tag used to wrap the text snippet
       * @default: <span />
       */
      tag: {
        type: String,
        default: 'span'
      },
      /**
       * Text to be copied AKA text snippet
       */
      text: {
        type: String,
        default: null
      },
      /**
       * Text for the hidden button (for assistive tech users)
       */
      buttonText: {
        type: String,
        default: null
      },
      /**
       * Text to help the user interact with the snippet
       */
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

  .snippet-wrapper {
    border-radius: 6px;
    display: flex;
    border: 1px solid transparent;
    transition: border $standard-transition;

    &:hover {
      overflow: hidden;
      border: 1px solid $blue;
      transition: border $standard-transition;
    }
  }

  .snippet {
    cursor: pointer;
    color: $mediumgrey;
    background: $whitegrey;
    border-radius: 6px;
    padding: 0.75rem;
    word-wrap: break-word;
    font-size: $font-size-small;
    overflow-y: auto;
    display: block;
    margin: 0;
    max-height: 6.5em;
    width: 100%;
    max-width: 100%;

  }

  code.snippet {
    font-size: $font-size-extrasmall;
  }

  .copy-button {

    &:focus {
      + .snippet {
        outline: auto;
      }
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

<docs lang="md">
  ```jsx
  <ItemSnippetCopyButton
    text="Example text snippet that can be copied. This element has max height and will overflow with a scrollbar on about 3 lines of text."
    button-text="Copy the text snippet"
  />
  ```

  With help text
  ```jsx
  <ItemSnippetCopyButton
    text="Example text snippet that can be copied. This element has max height and will overflow with a scrollbar on about 3 lines of text."
    button-text="Copy the text snippet"
    help-text="Click on the text to copy it"
  />
  ```

  With help text and 'code' tag
  ```jsx
  <ItemSnippetCopyButton
    tag="code"
    text="<p>Example text snippet that can be copied. This element has max height and will overflow with a scrollbar on about 3 lines of text.</p>"
    button-text="Copy the text snippet"
    help-text="Click on the code to copy it"
  />
  ```
</docs>
