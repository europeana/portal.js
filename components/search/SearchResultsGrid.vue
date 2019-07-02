<template>
  <b-card-group
    id="searchResults"
    deck
  >
    <ContentCard
      v-for="result in results"
      :key="result.europeanaId"
      :name="result.fields.dcTitle[0]"
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
        if (Array.isArray(result.fields.dcCreator)) {
          let creator =  result.fields.dcCreator.slice(0, 3).join('; ');
          if (result.fields.dcCreator.length > 3) {
            creator = creator + '...';
          }
          texts.push(creator);
        }
        if (Array.isArray(result.fields.edmDataProvider)) {
          let provider = result.fields.edmDataProvider.slice(0, 3).join('; ');
          if (result.fields.edmDataProvider.length > 3) {
            provider = provider + '...';
          }
          texts.push(provider);
        }
        return texts;
      }
    }
  };
</script>
