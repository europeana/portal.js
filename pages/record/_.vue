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
        cols="12"
        md="4"
      >
        <MediaPlayer
          v-if="play.playerType"
          :url="play.url"
          :playerType="play.playerType"
          :mimeType="play.mimeType"
          :image="image.src"
        />
        <MediaImage
          v-else-if="image.src"
          :link="image.link"
          :src="image.src"
        />
      </b-col>
      <b-col>
        <MetadataField
          v-for="(value, name) in fields"
          :key="name"
          :name="name"
          :value="value"
          class="border-bottom mb-3"
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
  import MetadataField from '../../components/record/MetadataField';
  import MediaImage from '../../components/record/MediaImage';
  import MediaPlayer from '../../components/record/MediaPlayer';

  import getRecord from '../../plugins/europeana/record';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaImage,
      MediaPlayer
    },
    data () {
      return {
        error: null,
        image: null,
        fields: null,
        media: null,
        play: {}
      };
    },
    asyncData ({ env, params, res }) {
      return getRecord(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      }).then((result) => {
        return result.record;
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
