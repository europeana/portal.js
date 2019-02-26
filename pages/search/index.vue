<template>
  <b-container>
    <b-row>
      <b-col><h1>Search</h1></b-col>
    </b-row>
    <b-row
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
            <LoadingSpinner
              v-show="isLoading"
              class="ml-2 mb-1"
            />
          </b-button>
        </b-form>
      </b-col>
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
                  :class="key"
                >
                  <pre v-if="!Array.isArray(value)">
                    <code>{{ value }}</code>
                  </pre>
                  <template v-else-if="value.length == 1">
                    {{ value[0] }}
                  </template>
                  <ul v-else>
                    <li
                      v-for="(element, index) in value"
                      :key="index"
                    >
                      {{ element }}
                    </li>
                  </ul>
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
  import LoadingSpinner from '~/components/LoadingSpinner.vue';
  import search from '~/plugins/europeana/search';

  export default {
    components: {
      LoadingSpinner
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
      return search({
        query: query.query,
        wskey: env.EUROPEANA_API_KEY
      })
        .then((results) => {
          return { ...results, isLoading: false, query: query.query };
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
