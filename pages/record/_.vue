<template>
  <b-container v-if="error">
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="record page"
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
      <b-col>
        <MediaActionBar
          v-if="selectedMedia"
          :url="selectedMedia.about"
          :europeana-identifier="identifier"
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
  import MediaActionBar from '../../components/record/MediaActionBar';
  import AlertMessage from '../../components/generic/AlertMessage';
  import WebResources from '../../components/record/WebResources';
  import MetadataField from '../../components/record/MetadataField';
  import MediaPresentation from '../../components/record/MediaPresentation';

  import getRecord from '../../plugins/europeana/record';
  import { searchEntities } from '../../plugins/europeana/entity';

  export default {
    components: {
      MediaActionBar,
      AlertMessage,
      WebResources,
      MetadataField,
      MediaPresentation
    },
    data() {
      return {
        error: null,
        identifier: null,
        image: null,
        fields: null,
        media: null,
        agents: null,
        concepts: null,
        relatedEntities: null
      };
    },
    computed: {
      europeanaAgents() {
        return (this.agents || []).filter((agent) => agent.about.startsWith('http://data.europeana.eu/agent/'));
      },
      europeanaConcepts() {
        return (this.concepts || []).filter((concept) => concept.about.startsWith('http://data.europeana.eu/concept/'));
      },
      europeanaEntityUris() {
        const entities = this.europeanaConcepts.concat(this.europeanaAgents);
        return entities.map((entity) => entity.about).slice(0, 5);
      },
      selectedMedia() {
        return this.media[0];
      }
    },
    asyncData({ env, params, res, app, redirect }) {
      if (env.RECORD_PAGE_REDIRECT_PATH) {
        return redirect(app.localePath({ path: env.RECORD_PAGE_REDIRECT_PATH }));
      }

      return getRecord(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      })
        .then((result) => {
          return result.record;
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    async mounted() {
      this.relatedEntities = await searchEntities(this.europeanaEntityUris, { wskey: process.env.EUROPEANA_ENTITY_API_KEY });
    },
    head() {
      return {
        title: this.$t('record')
      };
    }
  };
</script>
