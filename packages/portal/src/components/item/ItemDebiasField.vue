<template>
  <TextQuoteSelector
    :selector="terms[name]"
    :tag="tag"
    :text="text"
  >
    <template #default="{ index, text: term }">
      <ItemDebiasTerm
        :id="`item-debias-term-${name}-${index}`"
        :definition="definitions[term]"
        :term="term"
        :tooltip-id="`item-debias-term-tooltip-${name}-${index}`"
      />
    </template>
  </TextQuoteSelector>
</template>

<script>
  import ItemDebiasTerm from './ItemDebiasTerm';
  import TextQuoteSelector from '../text/TextQuoteSelector';
  import useDeBias from '@/composables/deBias.js';

  export default {
    name: 'ItemDebiasField',

    components: {
      ItemDebiasTerm,
      TextQuoteSelector
    },

    props: {
      name: {
        type: String,
        required: true
      },

      tag: {
        type: String,
        default: 'p'
      },

      text: {
        type: String,
        required: true
      }
    },

    setup() {
      const { definitions, terms } = useDeBias();

      return { definitions, terms };
    }
  };
</script>
