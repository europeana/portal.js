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
        <MediaImage
          :link="image.link"
          :src="image.src"
        />
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
        image: null,
        fields: null,
        media: null
      };
    },
    asyncData ({ env, params, res }) {
      return getRecord(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      }).then((result) => {
        return { image: result.record.image, fields: result.record.fields, media: result.record.media };
      })
        .catch((err) => {
          if (typeof res !== 'undefined') {
            res.statusCode = err.message.startsWith('Invalid record identifier: ') ? 404 : 500;
          }
          return { error: err.message };
        });
    },
    head () {
      return {
        title: 'Record'
      };
    }
  };
</script>
