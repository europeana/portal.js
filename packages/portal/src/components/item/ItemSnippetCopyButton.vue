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
    display: inline-block;
    margin: 0;
    max-height: 6.5em;
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
