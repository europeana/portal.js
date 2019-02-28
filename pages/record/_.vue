<template>
  <b-container
    v-if="error"
    class="mb-3"
  >
    <AlertMessage
      :error="error"
    />
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
  import AlertMessage from '../../components/generic/AlertMessage';
  import WebResources from '../../components/record/WebResources';
  import MetaData from '../../components/record/MetaData';
  import MediaImage from '../../components/record/MediaImage';

  import getRecord from '../../plugins/record';

  export default {
    asyncData ({ env, params }) {
      return getRecord({
        path: params.pathMatch,
        key: env.EUROPEANA_API_KEY
      }).then((record) => {
        return { image: record.image, error: null, fields: record.fields, media: record.media };
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
