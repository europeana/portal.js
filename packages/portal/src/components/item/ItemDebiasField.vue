<template>
  <TextQuoteSelector
    :selector="selectors"
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
      /**
       * Name of the metadata field(s), e.g. dcTitle, dcSubject
       */
      name: {
        type: [String, Array],
        required: true
      },

      /**
       * HTML tag to use
       */
      tag: {
        type: String,
        default: 'span'
      },

      /**
       * Text for this metadata field value
       */
      text: {
        type: String,
        required: true
      }
    },

    computed: {
      selectors() {
        return [].concat(this.name).map((name) => this.deBias.terms[name]).flat();
      }
    }
  };
</script>
