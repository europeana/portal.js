<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
      v-if="error"
      class="mb-3"
    >
      <b-col>
        <b-alert
          show
          variant="dark"
        >
          <strong>Error:</strong> {{ error }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row
      v-else
      class="mb-5"
    >
      <b-col>
        <b-form
          inline
          @submit.prevent="submitSearchForm"
        >
          <b-form-input
            id="searchQuery"
            v-model="query"
            placeholder="What are you looking for?"
            name="query"
            class="mr-2 w-75"
          />
          <b-button
            variant="primary"
            type="submit"
          >
            Search
            <Spinner
              v-show="isLoading"
              class="ml-2 mb-1"
            />
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row
      v-if="totalResults === 0"
      class="mb-3"
    >
      <b-col>
        <b-alert
          show
          variant="dark"
        >
          No results.
        </b-alert>
      </b-col>
    </b-row>
    <b-row
      v-if="results !== null"
      class="mb-3"
    >
      <b-col>
        <b-list-group
          id="searchResults"
        >
          <!-- TODO: switch :href for :to if/when API permits CORS requests to record.json -->
          <b-list-group-item
            v-for="result in results"
            :key="result.europeanaId"
            :href="result.linkTo"
            class="flex-column align-items-start mb-3"
          >
            <b-media no-body>
              <b-media-aside class="w-25 mr-3">
                <b-img
                  v-if="result.edmPreview"
                  slot="aside"
                  :src="result.edmPreview"
                  class="mw-100"
                />
              </b-media-aside>
              <b-media-body>
                <div
                  v-for="(value, key) in result.fields"
                  :key="key"
                >
                  <template v-if="value">
                    <div><strong>{{ key }}</strong></div>
                    <pre><code>{{ value }}</code></pre>
                  </template>
                </div>
              </b-media-body>
            </b-media>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Spinner from '~/components/Spinner.vue';
  import axios from 'axios';

  function genericThumbnail(edmType) {
    return `https://api.europeana.eu/api/v2/thumbnail-by-url.json?size=w200&uri=&type=${edmType}`;
  }

  function resultsFromApiResponse(response) {
    const items = response.data.items;

    const results = items.map(item => {
      return {
        europeanaId: item.id,
        edmPreview: item.edmPreview ? `${item.edmPreview[0]}&size=w200` : genericThumbnail(item.type),
        linkTo: `record${item.id}`,
        fields: {
          // TODO: fallback to description when API returns dcDescriptionLangAware
          dcTitle: item.dcTitleLangAware ? item.dcTitleLangAware : `No title provided for record ID ${item.id}`,
          dcCreator: item.dcCreatorLangAware,
          // TODO: enable when API returns dcDescriptionLangAware
          // dcDescription: item.dcDescriptionLangAware,
          edmDataProvider: item.dataProvider[0]
        }
      };
    });

    return results;
  }

  export default {
    components: {
      Spinner
    },
    data () {
      return {
        error: null,
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
            isLoading: false
          };
        })
        .catch((error) => {
          if (typeof error.response === 'undefined') {
            throw error;
          }
          return {
            error: error.response.data.error
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
      submitSearchForm () {
        if (this.$route.query.query !== this.query) {
          this.isLoading = true;
        }
        this.$router.push({ name: 'search', query: { query: this.query ? this.query : '' } });
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
