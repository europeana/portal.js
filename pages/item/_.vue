<template>
  <b-container v-if="error">
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="item page"
    class="mt-5"
  >
    <b-row class="mb-3 mx-0 card p-3">
      <b-col
        cols="12"
        class="mb-3 px-0"
      >
        <MediaPresentation
          v-if="selectedMedia"
          :codec-name="selectedMedia.edmCodecName"
          :image-link="image.link"
          :image-src="image.src"
          :mime-type="selectedMedia.ebucoreHasMimeType"
          :url="selectedMedia.about"
          :width="selectedMedia.ebucoreWidth"
          :height="selectedMedia.ebucoreHeight"
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
      <!-- TODO: remove when the carousel has come to town. -->
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
  import WebResources from '../../components/item/WebResources';
  import MetadataField from '../../components/item/MetadataField';
  import MediaPresentation from '../../components/item/MediaPresentation';

  import getItem from '../../plugins/europeana/item';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaPresentation
    },
    data() {
      return {
        error: null,
        image: null,
        fields: null,
        media: null
      };
    },
    computed: {
      selectedMedia() {
        return this.media[0];
      }
    },
    asyncData({ env, params, res, app, redirect }) {
      const redirectPath = env.ITEM_PAGE_REDIRECT_PATH || env.RECORD_PAGE_REDIRECT_PATH;
      if (redirectPath) {
        return redirect(app.localePath({ path: redirectPath }));
      }

      return getItem(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      })
        .then((result) => {
          return result.item;
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    head() {
      return {
        title: this.$t('item')
      };
    }
  };
</script>
