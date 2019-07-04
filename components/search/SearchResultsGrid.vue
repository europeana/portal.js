<template>
  <b-card-group
    class="card-deck-3-cols card-deck-search"
    deck
  >
    <ContentCard
      v-for="result in results"
      :key="result.europeanaId"
      :title="result.fields.dcTitle[0]"
      :url="localePath({ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } })"
      :image-url="result.edmPreview"
      :texts="cardTexts(result)"
      data-qa="search result"
    />
  </b-card-group>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

  export default {
    components: {
      ContentCard
    },
    props: {
      results: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      cardTexts: function (result) {
        let texts = [];
        for (const field of ['dcCreator', 'edmDataProvider']) {
          if (result.fields[field]) {
            texts.push(this.stringifyField(result.fields[field]));
          }
        }
        return texts;
      },
      stringifyField: function (field) {
        // TODO: Rather than joining as strings, cards should handle arrays so this method can be skipped.
        let returnString = field;
        if (Array.isArray(field)) {
          returnString = field.slice(0, 3).join(this.$t('formatting.listSeperator') + ' ');
          if (field.length > 3) {
            returnString = returnString + this.$t('formatting.listSeperator') + this.$t('formatting.ellipsis');
          }
        }
        return returnString;
      }
    }
  };
</script>
