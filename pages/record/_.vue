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
        cols="12"
        class="px-0 mb-3"
      >
        <MediaPresentation
          :codec-name="edmIsShownBy.edmCodecName"
          :image-link="image.link"
          :image-src="image.src"
          :mime-type="edmIsShownBy.ebucoreHasMimeType"
          :url="edmIsShownBy.rdfAbout"
        />
      </b-col>
      <b-col
        cols="12"
      >
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
  import MediaPresentation from '../../components/record/MediaPresentation';

  import getRecord from '../../plugins/europeana/record';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaPresentation
    },
    data () {
      return {
        error: null,
        image: null,
        fields: null,
        media: null,
        edmIsShownBy: {}
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
        title: this.$t('record')
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
