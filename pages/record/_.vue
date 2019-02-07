<template>
  <b-container
    v-if="error"
    class="mb-3"
  >
    <b-alert
      show
      variant="dark"
    >
      <strong>Error:</strong> {{ error }}
    </b-alert>
  </b-container>
  <b-container v-else>
    <b-row>
      <b-col><h1>Record</h1></b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col
        v-if="image.src"
        cols="12"
        md="4"
      >
        <a :href="image.link">
          <img
            :src="image.src"
            class="mw-100 mb-3"
            alt="Record"
          >
        </a>
      </b-col>
      <b-col>
        <div>
          <div
            v-for="(value, key) in fields"
            :key="key"
          >
            <div
              v-if="value"
              class="border-bottom mb-3"
            >
              <strong>{{ key }}</strong><br>
              <pre>{{ value }}</pre>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <h2>Media</h2>
        <b-list-group>
          <b-list-group-item
            v-for="webResource in media"
            :key="webResource.rdfAbout"
          >
            <div
              v-for="(value, key) in webResource"
              :key="key"
            >
              <p v-if="value">
                <strong>{{ key }}</strong><br>
                <pre>{{ value }}</pre>
              </p>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  function dataFromApiResponse(response) {
    const edm = response.data.object;
    const providerAggregation = edm.aggregations[0];
    const europeanaAggregation = edm.europeanaAggregation;
    const providerProxy = edm.proxies.find((proxy) => {
      return proxy.europeanaProxy === false;
    });
    const edmLanguage = europeanaAggregation.edmLanguage['def'][0];

    const webResources = providerAggregation.webResources.map(webResource => {
      return {
        dcDescription: webResource.dcDescription,
        edmRights: webResource.webResourceEdmRights,
        rdfAbout: webResource.about
      };
    });

    return {
      error: null,
      image: {
        link: providerAggregation.edmIsShownAt,
        src: europeanaAggregation.edmPreview
      },
      fields: {
        dcContributor: providerProxy.dcContributor,
        dcCreator: providerProxy.dcCreator,
        dcDescription: providerProxy.dcDescription,
        dcTitle: providerProxy.dcTitle,
        dcType: providerProxy.dcType,
        dctermsCreated: providerProxy.dctermsCreated,
        edmCountry: europeanaAggregation.edmCountry,
        edmDataProvider: providerAggregation.edmDataProvider,
        edmLanguage: edmLanguage,
        edmRights: providerAggregation.edmRights
      },
      media: webResources
    };
  }

  export default {
    asyncData ({ params }) {
      return axios.get(`https://api.europeana.eu/api/v2/record/${params.pathMatch}.json?wskey=${process.env.EUROPEANA_API_KEY}`)
        .then((response) => {
          return dataFromApiResponse(response);
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
    head () {
      return {
        title: 'Record'
      };
    }
  };
</script>
