<template>
  <b-list-group
    v-if="view === 'list'"
    data-qa="search results list"
  >
    <b-list-group-item
      v-for="result in value"
      :key="result.europeanaId"
      :to="localePath({ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } })"
      class="flex-column align-items-start mb-3"
      data-qa="search result"
    >
      <SearchResult
        :edm-preview="result.edmPreview"
        :edm-data-provider="result.edmDataProvider"
        :dc-title="result.dcTitle"
        :dc-description="result.dcDescription"
        :dc-creator="result.dcCreator"
      />
    </b-list-group-item>
  </b-list-group>
  <b-card-group
    v-else
    :class="`card-deck-search card-deck-${perRow}-cols`"
    deck
    data-qa="search results grid"
  >
    <ContentCard
      v-for="result in value"
      :key="result.europeanaId"
      :title="result.dcTitle || result.dcDescription"
      :url="{ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } }"
      :image-url="result.edmPreview"
      :texts="cardTexts(result)"
      data-qa="search result"
      :limit-values-within-each-text="3"
      :omit-uris-if-other-values="true"
    />
  </b-card-group>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import SearchResult from './SearchResult';

  export default {
    name: 'SearchResults',

    components: {
      ContentCard,
      SearchResult
    },

    props: {
      value: {
        type: Array,
        default: () => []
      },
      perRow: {
        type: Number,
        default: 4
      }
    },

    computed: {
      view() {
        return this.$store.getters['search/activeView'];
      }
    },

    methods: {
      cardTexts(result) {
        const texts = [result.edmDataProvider];
        if (result.dcCreator) texts.unshift(result.dcCreator);
        return texts;
      }
    }
  };
</script>
