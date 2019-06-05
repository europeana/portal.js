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
    data-qa="entity page"
  >
    <b-row>
      <b-col>
        <h1 data-qa="entity title">
          {{ title }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        md="9"
      >
        <BrowseChip
          v-for="entity in relatedEntities"
          :key="entity.path"
          :path="entity.path"
          :type="entity.type"
          :title="entity.title"
        />
      </b-col>
      <b-col
        cols="12"
        md="3"
        class="pb-3"
      >
        <EntityDetails
          :depiction="depiction"
          :attribution="attribution"
          :description="description"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../../components/generic/AlertMessage';
  import BrowseChip from '../../../components/browse/BrowseChip';
  import EntityDetails from '../../../components/browse/EntityDetails';

  import getEntity, { getEntityPath, relatedEntities } from '../../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage,
      BrowseChip,
      EntityDetails
    },
    data () {
      return {
        error: null,
        title: null,
        depiction: null,
        attribution: null,
        description: null,
        relatedEntities: null
      };
    },
    asyncData ({ env, params, res, redirect, app }) {
      return axios.all([
        getEntity(params.type, params.pathMatch, { wskey: env.EUROPEANA_ENTITY_API_KEY }),
        relatedEntities(params.type, params.pathMatch, { wskey: env.EUROPEANA_API_KEY, entityKey: env.EUROPEANA_ENTITY_API_KEY })
      ])
        .then(axios.spread((entity, related) => {
          const desiredPath = getEntityPath(params.pathMatch, entity.entity.prefLabel.en);

          if (params.pathMatch !== desiredPath) {
            const redirectPath = app.localePath({ name: 'entity-type-all', params: { type: params.type, pathMatch: encodeURIComponent(desiredPath) } });
            return redirect(302, redirectPath);
          }

          let description;

          if (params.type === 'topic') {
            description = entity.entity.note && entity.entity.note.en ? entity.entity.note.en[0] : '';
          } else if (params.type === 'person') {
            if (entity.entity.biographicalInformation.length !== undefined) {
              description = entity.entity.biographicalInformation ? entity.entity.biographicalInformation.filter(info => info['@language'] === 'en')[0]['@value'] : '';
            } else {
              description = entity.entity.biographicalInformation['@language'] === 'en' ? entity.entity.biographicalInformation['@value'] : '';
            }
          }

          return {
            error: null,
            title: entity.entity.prefLabel.en,
            depiction: entity.entity.depiction ? entity.entity.depiction.id + '?width=348' : '',
            attribution: entity.entity.depiction ? entity.entity.depiction.source : '',
            description: description,
            relatedEntities: related
          };
        }))
        .catch((err) => {
          if (typeof res !== 'undefined') {
            res.statusCode = err.message.startsWith('No resource found with ID:') ? 404 : 500;
          }
          return { error: err.message };
        });
    },
    head () {
      return {
        title: this.$t('entity')
      };
    }
  };
</script>
