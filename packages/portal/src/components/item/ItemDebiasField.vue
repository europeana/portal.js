<template>
  <TextQuoteSelector
    :selector="deBias.terms[name]"
    :tag="tag"
    :text="text"
  >
    <template #default="{ index, text: termText }">
      <ItemDebiasTerm
        :id="`item-debias-term-${name}-${index}`"
        :definition="deBias.definitions[termText]"
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

  export default {
    name: 'ItemDebiasField',

    components: {
      ItemDebiasTerm,
      TextQuoteSelector
    },

    inject: ['deBias'],

    props: {
      name: {
        type: String,
        required: true
      },

      tag: {
        type: String,
        default: 'span'
      },

      text: {
        type: String,
        required: true
      }
    }
  };
</script>
