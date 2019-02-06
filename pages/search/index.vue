<template>
  <section class="container">
    <h1 class="title">
      Search
    </h1>

    <p v-if="error">
      <strong>Error:</strong> {{ error }}
    </p>
    <b-container v-else>
      <b-form
        inline
        @submit.prevent="submitSearchForm"
      >
        <b-form-input
          id="searchQuery"
          v-model="query"
          placeholder="What are you looking for?"
          name="query"
        />
        <b-button
          variant="primary"
          type="submit"
        >
          Search
        </b-button>
      </b-form>
      <p v-if="totalResults === 0">
        No results.
      </p>
      <b-list-group v-else>
        <!-- TODO: switch :href for :to if/when API permits CORS requests to record.json -->
        <b-list-group-item
          v-for="result in results"
          :key="result.europeanaId"
          :href="result.linkTo"
          class="flex-column align-items-start"
        >
          <b-media right-align>
            <b-img
              v-if="result.edmPreview"
              slot="aside"
              :src="result.edmPreview"
            />
            <dl>
              <div
                v-for="(value, key) in result.fields"
                :key="key"
              >
                <template v-if="value">
                  <dt>{{ key }}</dt>
                  <dd><pre>{{ value }}</pre></dd>
                </template>
              </div>
            </dl>
          </b-media>
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </section>
</template>

<script>
  import axios from 'axios';

  function resultsFromApiResponse(response) {
    const items = response.data.items;

    const results = items.map(item => {
      return {
        europeanaId: item.id,
        edmPreview: item.edmPreview ? `${item.edmPreview[0]}&size=w200` : null,
        linkTo: `record${item.id}`,
        fields: {
          dcTitle: item.dcTitleLangAware,
          dcCreator: item.dcCreatorLangAware,
          edmDataProvider: item.dataProvider[0],
          edmLanguage: item.language[0]
        }
      };
    });

    return results;
  }

  export default {
    data () {
      return {
        error: null,
        results: null,
        totalResults: null,
        query: null
      };
    },
    asyncData ({ query }) {
      if (typeof query.query === 'undefined') {
        return;
      }
      return axios.get('https://api.europeana.eu/api/v2/search.json', {
        params: {
          rows: 24,
          wskey: process.env.EUROPEANA_API_KEY,
          query: query.query
        }
      })
        .then((response) => {
          return {
            error: null,
            results: resultsFromApiResponse(response),
            totalResults: response.data.totalResults,
            query: query.query
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
        document.getElementById('searchQuery').focus();
      });
    },
    methods: {
      submitSearchForm () {
        this.$router.push({ name: 'search', query: { query: this.query } });
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
