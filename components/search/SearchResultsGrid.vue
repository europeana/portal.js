<template>
  <b-card-group columns
    id="searchResults"
  >
    <ContentCard
      v-for="result in results"
      :key="result.europeanaId"
      :name="result.fields.dcTitle"
      :url="localePath({ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } })"
      :image-url="result.edmPreview"
      :creator="result.fields.dcCreator"
      :provider="result.fields.edmDataProvider"
      :identifier="result.europeanaId"
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
    }
  };
</script>
