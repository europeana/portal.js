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
      :title="result.fields.dcTitle[0]"
      :url="{ name: 'record-all', params: { pathMatch: result.europeanaId.slice(1) } }"
      :image-url="result.edmPreview"
      :texts="cardTexts(result)"
      data-qa="search result"
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
        let texts = [];
        for (const field of ['dcCreator', 'edmDataProvider']) {
          if (result.fields[field]) {
            texts.push(this.stringifyField(result.fields[field]));
          }
        }
        return texts;
      },

      stringifyField(field) {
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
