<template>
  <TextQuoteSelector
    :selector="terms[name]"
    :tag="tag"
    :text="text"
  >
    <template #default="{ index, text: termText }">
      <ItemDebiasTerm
        :id="`item-debias-term-${name}-${index}`"
        :definition="definitions[termText]"
        :term="termText"
        :tooltip-id="`item-debias-term-tooltip-${name}-${index}`"
      >
        <slot :text="termText">
          {{ termText }}
        </slot>
      </ItemDebiasTerm>
    </template>
    <template #other="{ text: otherText }">
      <slot :text="otherText">
        {{ otherText }}
      </slot>
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
