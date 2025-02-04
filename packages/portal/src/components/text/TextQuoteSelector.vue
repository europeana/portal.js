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

    created() {
      this.chunks = this.chunksOfText();
    },

    methods: {
      chunksOfText() {
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
            text: selector.exact['@value']
          });
          startIndex = selector.index + selector.exact['@value'].length;
        }

        const textToEnd = this.text.slice(startIndex);
        chunks.push({
          selected: false,
          text: textToEnd
        });

        return chunks.filter((chunk) => chunk.text.length > 0);
      },

      selectorWithIndex(selector) {
        const prefix = selector.prefix || '';
        const exact = selector.exact['@value'];
        const suffix = selector.suffix || '';
        const fulltext = `${prefix}${exact}${suffix}`;

        return {
          ...selector,
          // index of the start of the exact match
          index: this.text.indexOf(fulltext) + prefix.length
        };
      },

      selectorsWithIndexes() {
        return []
          .concat(this.selector)
          .filter((selector) => selector?.exact?.['@value'])
          .map(this.selectorWithIndex)
          .filter((selector) => selector.index > -1)
          .sort((a, b) => a.index - b.index);
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
        exact: { '@value': 'with' },
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
          exact: { '@value': 'sentence' },
          suffix: ' with'
        },
        {
          exact: { '@value': 'This' },
          suffix: ' is a'
        },
        {
          prefix: 'words to ',
          exact: { '@value': 'select' }
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
          exact: { '@value': 'default' },
          suffix: ' slot is'
        },
        {
          prefix: 'and the ',
          exact: { '@value': 'other' },
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
