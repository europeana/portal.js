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
    class="mt-5"
  >
    <b-row class="mb-3 mediacard">
      <b-col
        v-if="image.src"
        cols="12"
        md="4"
        class="pl-0"
      >
        <MediaImage
          :link="image.link"
          :src="image.src"
        />
        <p>
          <b-link
            v-if="pdf"
            :href="pdf"
            target="_blank"
          >
            View PDF
          </b-link>
        </p>
      </b-col>
      <b-col>
        <MetadataField
          v-for="(value, name) in fields"
          :key="name"
          :name="name"
          :value="value"
          class="mb-3"
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

  import getRecord from '../../plugins/europeana/record';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaImage
    },
    data () {
      return {
        error: null,
        image: null,
        fields: null,
        media: null,
        pdf: null
      };
    },
    asyncData ({ env, params, res }) {
      return getRecord(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      }).then((result) => {
        return { image: result.record.image, pdf: result.record.pdfLink, fields: result.record.fields, media: result.record.media };
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

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .mediacard {
    background: $white;
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-small;
    padding: 1rem;
  }
</style>

