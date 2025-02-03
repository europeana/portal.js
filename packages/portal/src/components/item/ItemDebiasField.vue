<!-- <TextQuoteSelector
  :text="text"
  :selector="termsToHighlight(field)"
>
  <template v-slot:default="{ text }">
    <ItemDebiasTerm
      :definition="definitionOfTerm(text)"
      :term="text"
    />
  </template>
</TextQuoteSelector>
 -->
<template>
  <span>
    {{ text }}
    <ItemDebiasTerm
      v-for="(selector, index) in termsToHighlight(field)"
      :key="index"
      :definition="definitionOfTerm(selector.exact['@value'])"
      :term="selector.exact['@value']"
    />
  </span>
</template>

<script>
  import ItemDebiasTerm from './ItemDebiasTerm';
  // import TextQuoteSelector from '../text/TextQuoteSelector';
  import useDeBias from '@/composables/deBias.js';

  export default {
    name: 'ItemDebiasField',

    components: {
      ItemDebiasTerm
      // TextQuoteSelector
    },

    props: {
      name: {
        type: String,
        required: true
      },

      text: {
        type: String,
        required: true
      }
    },

    setup() {
      const { definitionOfTerm, termsToHighlight } = useDeBias();

      return { definitionOfTerm, termsToHighlight };
    },

    created() {
      this.field = this.namespaceFieldName();
    },

    methods: {
      // converts e.g. dcTitle to dc:title
      namespaceFieldName() {
        if (!this.name.includes(':')) {
          const match = this.name.match(/[A-Z]/);
          if (match?.index) {
            return this.name.slice(0, match.index) + ':' + match[0].toLocaleLowerCase() + this.name.slice(match.index + 1);
          }
        }
        return this.name;
      }
    }
  };
</script>
