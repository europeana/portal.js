<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
      class="mb-5"
    >
      <b-col>
        <SearchForm
          :is-loading="isLoading"
          @update="updateIsLoading"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="error"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="error"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="totalResults === 0"
      class="mb-3"
    >
      <b-col>
        <AlertMessage
          :error="errorNoResults"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="results !== null"
      class="mb-3"
    >
      <b-col>
        <SearchResultsList :results="results" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../components/generic/AlertMessage';
  import SearchForm from '../../components/search/SearchForm';
  import SearchResultsList from '../../components/search/SearchResultsList';

  function genericThumbnail(edmType) {
    return `https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w200&uri=&type=${edmType}`;
  }

  /**
   * Extract the value to display for a field
   * @param {Object} field language map field from API response
   * @return {?(Object|String)} value to display
   */
  function display(field) {
    if (!field) {
      return null;
    }

    let value;
    if (field.eng) {
      value = field.eng;
    } else if (field.en) {
      value = field.en;
    } else if (field.def) {
      value = field.def;
    } else if (Object.keys(field).length === 1) {
      value = field[Object.keys(field)[0]];
    } else {
      return field;
    }

    value = [...new Set(value)]; // remove duplicates
    // Remove URIs, but only if other values exist
    const withoutUris = value.filter((element) => {
      return !element.startsWith('http://') && !element.startsWith('https://');
    });
    if (withoutUris.length > 0) {
      value = withoutUris;
    }

    return value;
  }

  /**
   * Construct fields to display for one search result
   * @param {Object} item individual item returned by the API
   * @return {Object} fields to display for this item
   */
  function fieldsForSearchResult(item) {
    let fields = {
      // TODO: fallback to description when API returns dcDescriptionLangAware
      dcTitle: item.dcTitleLangAware ? display(item.dcTitleLangAware) : `No title provided for record ID ${item.id}`,
      // TODO: enable when API returns dcDescriptionLangAware
      // dcDescription: item.dcDescriptionLangAware,
      edmDataProvider: item.dataProvider
    };

    const dcCreator = display(item.dcCreatorLangAware);
    if (dcCreator) {
      fields.dcCreator = dcCreator;
    }

    return fields;
  }

  /**
   * Extract search results from API response
   * @param  {Object} response API response
   * @return {Object[]} search results
   */
  function resultsFromApiResponse(response) {
    const items = response.data.items;

    const results = items.map(item => {
      return {
        europeanaId: item.id,
        edmPreview: item.edmPreview ? `${item.edmPreview[0]}&size=w200` : genericThumbnail(item.type),
        linkTo: `record${item.id}`,
        fields: fieldsForSearchResult(item)
      };
    });

    return results;
  }

  export default {
    components: {
      AlertMessage,
      SearchForm,
      SearchResultsList
    },
    data () {
      return {
        error: null,
        errorNoResults: 'No results',
        isLoading: false,
        results: null,
        totalResults: null,
        query: null
      };
    },
    asyncData ({ env, query }) {
      if (typeof query.query === 'undefined') {
        return;
      }
      return axios.get('https://api.europeana.eu/api/v2/search.json', {
        params: {
          profile: 'minimal',
          query: query.query == '' ? '*:*' : query.query,
          rows: 24,
          wskey: env.EUROPEANA_API_KEY
        }
      })
        .then((response) => {
          return {
            results: resultsFromApiResponse(response),
            totalResults: response.data.totalResults,
            query: query.query,
            isLoading: false,
            error: null
          };
        })
        .catch((error) => {
          if (typeof error.response === 'undefined') {
            throw error;
          }
          return {
            error: error.response.data.error,
            query: '',
            results: null
          };
        });
    },
    mounted () {
      this.$nextTick(() => {
        if (document.getElementById('searchResults') === null) {
          const searchQuery = document.getElementById('searchQuery');
          if (searchQuery) {
            searchQuery.focus();
          }
        }
      });
    },
    methods: {
      updateIsLoading (status) {
        this.isLoading = status;
      }
    },
    head () {
      return {
        title: 'Search'
      };
    },
    watchQuery: ['query']
  };
</script>
