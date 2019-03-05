<template>
  <b-container
    v-if="error"
    class="mb-3"
  >
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="record page"
  >
    <b-row>
      <b-col><h1>Record</h1></b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col
        v-if="image.src"
        cols="12"
        md="4"
      >
        <MediaImage :image="image" />
      </b-col>
      <b-col>
        <MetaData
          :fields="fields"
        />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <h2>Media</h2>
        <WebResources
          :media="media"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';
  import omitBy from 'lodash/omitBy';

  import AlertMessage from '../../components/generic/AlertMessage';
  import WebResources from '../../components/record/WebResources';
  import MetaData from '../../components/record/MetaData';
  import MediaImage from '../../components/record/MediaImage';

  function dataFromApiResponse(response) {
    const edm = response.data.object;
    const providerAggregation = edm.aggregations[0];
    const europeanaAggregation = edm.europeanaAggregation;
    const providerProxy = edm.proxies.find((proxy) => {
      return proxy.europeanaProxy === false;
    });
    const edmLanguage = europeanaAggregation.edmLanguage['def'][0];

    const webResources = providerAggregation.webResources.map(webResource => {
      return omitBy({
        rdfAbout: webResource.about,
        dcDescription: webResource.dcDescription,
        edmRights: webResource.webResourceEdmRights
      }, (v) => {
        return v == null;
      });
    });

    return {
      error: null,
      image: {
        link: providerAggregation.edmIsShownAt,
        src: europeanaAggregation.edmPreview
      },
      fields: omitBy({
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
      }, (v) => {
        return v == null;
      }),
      media: webResources
    };
  }

  export default {
    asyncData ({ env, params }) {
      return axios.get(`https://api.europeana.eu/api/v2/record/${params.pathMatch}.json?wskey=${env.EUROPEANA_API_KEY}`)
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
    components: {
      AlertMessage,
      WebResources,
      MetaData,
      MediaImage
    },
    head () {
      return {
        title: 'Record'
      };
    }
  };
</script>
