<template>
  <p v-if="error">
    <strong>Error:</strong> {{ error }}
  </p>
  <b-container v-else>
    <b-row>
      <b-col><h1>Record</h1></b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <a :href="image.link">
          <img :src="image.src">
        </a>
      </b-col>
      <b-col>
        <dl>
          <div
            v-for="(value, key) in fields"
            :key="key"
          >
            <template v-if="value">
              <dt>{{ key }}</dt>
              <dd><pre>{{ value }}</pre></dd>
            </template>
          </div>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2>Media</h2>
        <b-list-group>
          <b-list-group-item>Cras justo odio</b-list-group-item>
          <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>
          <b-list-group-item>Morbi leo risus</b-list-group-item>
          <b-list-group-item>Porta ac consectetur ac</b-list-group-item>
          <b-list-group-item>Vestibulum at eros</b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>

  <!--<section class="container">
    <h1 class="title">
      Record
    </h1>

    <p v-if="error">
      <strong>Error:</strong> {{ error }}
    </p>
    <template v-else>
      <div>
        <a :href="image.link">
          <img :src="image.src">
        </a>
      </div>

      <dl>
        <div
          v-for="(value, key) in fields"
          :key="key"
        >
          <template v-if="value">
            <dt>{{ key }}</dt>
            <dd><pre>{{ value }}</pre></dd>
          </template>
        </div>
      </dl>

      <h2>Media</h2>
      <ul>
        <li
          v-for="webResource in media"
          :key="webResource.rdfAbout"
        >
          <dl>
            <div
              v-for="(value, key) in webResource"
              :key="key"
            >
              <template v-if="value">
                <dt>{{ key }}</dt>
                <dd><pre>{{ value }}</pre></dd>
              </template>
            </div>
          </dl>
        </li>
      </ul>
    </template>
  </section>-->
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
