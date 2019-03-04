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

  import getRecord from '../../plugins/europeana/record';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetaData,
      MediaImage
    },
    data () {
      return {
        error: null,
        record: null
      };
    },
    asyncData ({ env, params }) {
      return getRecord({
        path: params.pathMatch,
        key: env.EUROPEANA_API_KEY
      }).then((result) => {
        if (result.record === null) {
          return { image: null, error: result.error, fields: null, media: null };
        } else {
          return { image: result.record.image, error: null, fields: result.record.fields, media: result.record.media };
        }
      });
    },
    head () {
      return {
        title: 'Record'
      };
    }
  };
</script>
