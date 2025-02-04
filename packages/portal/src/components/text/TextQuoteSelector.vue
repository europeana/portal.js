<template>
  <component
    :is="tag"
    class="text-quote-selector"
  >
    <template
      v-for="(chunk, index) in chunks"
    >
      <slot
        v-if="chunk.selected"
        :index="index"
        :text="chunk.text"
      >
        <strong :key="index">{{ chunk.text }}</strong>
      </slot>
      <slot
        v-else
        name="other"
        :index="index"
        :text="chunk.text"
      >
        <span :key="index">{{ chunk.text }}</span>
      </slot>
    </template>
  </component>
</template>

<script>
  export default {
    name: 'TextQuoteSelector',

    props: {
      /**
       * Object or array of TextQuoteSelector objects with properties `exact`
       * (required), `suffix` (optional) and `prefix` (optional)
       */
      selector: {
        type: [Array, Object],
        default: null
      },

      /**
       * HTML element for the container
       */
      tag: {
        type: String,
        default: 'p'
      },

      /**
       * Text to scan for occurrences of selectors
       */
      text: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        chunks: { selected: false, text: this.text }
      };
    },

    watch: {
      selector() {
        this.initChunks();
      },

      text() {
        this.initChunks();
      }
    },

    created() {
      this.initChunks();
    },

    methods: {
      initChunks() {
        const chunks = [];
        let startIndex = 0;

        for (const selector of this.selectorsWithIndexes()) {
          const textBefore = this.text.slice(startIndex, selector.index);
          chunks.push({
            selected: false,
            text: textBefore
          });
          chunks.push({
            selected: true,
            text: selector.exact
          });
          startIndex = selector.index + selector.exact.length;
        }

        const textToEnd = this.text.slice(startIndex);
        chunks.push({
          selected: false,
          text: textToEnd
        });

        this.chunks = chunks.filter((chunk) => chunk.text.length > 0);
      },

      selectorsWithIndexes() {
        return []
          .concat(this.selector)
          .filter((selector) => selector?.exact)
          .map(this.selectorWithIndex)
          .filter((selector) => selector.index > -1)
          .sort((a, b) => a.index - b.index);
      },

      selectorWithIndex(selector) {
        let index = null;
        // if no prefix, only match at start
        if (!selector.prefix && !this.text.startsWith(selector.exact)) {
          index = -1;
        }
        // if no suffix, only match at end
        if (!selector.suffix && !this.text.endsWith(selector.exact)) {
          index = -1;
        }
        if (index === null) {
          const prefix = selector.prefix || '';
          const exact = selector.exact;
          const suffix = selector.suffix || '';
          const fulltext = `${prefix}${exact}${suffix}`;

          index = this.text.indexOf(fulltext)
          if (index > -1) {
            // index of the start of the exact match
            index = index + prefix.length;
          }
        }

        return { ...selector, index };
      }
    }
  };
</script>

<docs lang="md">
  ### No selector
  ```jsx
    <TextQuoteSelector
      text="This is a sentence"
    />
  ```

  ### Single selector
  ```jsx
    <TextQuoteSelector
      :selector="{
        prefix: 'a sentence ',
        exact: 'with',
        suffix: ' one word'
      }"
      text="This is a sentence with one word to select"
    />
  ```

  ### Multiple selectors
  ```jsx
    <TextQuoteSelector
      :selector="[
        {
          prefix: 'is a ',
          exact: 'sentence',
          suffix: ' with'
        },
        {
          exact: 'This',
          suffix: ' is a'
        },
        {
          prefix: 'words to ',
          exact: 'select'
        }
      ]"
      text="This is a sentence with multiple words to select"
    />
  ```

  ### Custom formatting
  Custom formatting using the `tag` prop and slots
  ```jsx
    <TextQuoteSelector
      :selector="[
        {
          prefix: 'The ',
          exact: 'default',
          suffix: ' slot is'
        },
        {
          prefix: 'and the ',
          exact: 'other',
          suffix: ' slot for'
        }
      ]"
      tag="q"
      text="The default slot is for selected words, and the other slot for others"
    >
      <template v-slot:default="{ text }">
        <code>{{ text }}</code>
      </template>
      <template v-slot:other="{ text }">
        <i>{{ text }}</i>
      </template>
    </TextQuoteSelector>
  ```
</docs>
