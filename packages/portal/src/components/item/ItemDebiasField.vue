<template>
  <TextQuoteSelector
    :selector="termsToHighlight(name)"
    :tag="tag"
    :text="text"
  >
    <template #default="{ index, text: term }">
      <ItemDebiasTerm
        :definition="definitionOfTerm(term)"
        :id="`item-debias-term-${name}-${index}`"
        :term="term"
        :tooltip-id="`item-debias-term-tooltip-${name}-${index}`"
      />
    </template>
  </TextQuoteSelector>
  <!-- <span>
    {{ text }}
    <ItemDebiasTerm
      v-for="(selector, index) in termsToHighlight(name)"
      :key="index"
      :definition="definitionOfTerm(selector.exact['@value'])"
      :term="selector.exact['@value']"
    />
  </span> -->
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
      const { definitionOfTerm, termsToHighlight } = useDeBias();

      return { definitionOfTerm, termsToHighlight };
    }
  };
</script>
