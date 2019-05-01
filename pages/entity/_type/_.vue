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
      <b-col cols="12" md="9">
        <BrowseChip
          :related-entities="relatedEntities"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import axios from 'axios';

  import AlertMessage from '../../../components/generic/AlertMessage';
  import BrowseChip from '../../../components/browse/BrowseChip';

  import getEntity, { getEntityPath, relatedEntities } from '../../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage,
      BrowseChip
    },
    data () {
      return {
        error: null,
        title: null,
        relatedEntities: null
      };
    },
    asyncData ({ env, params, res, redirect }) {
      return axios.all([
        getEntity(params.type, params.pathMatch, { wskey: env.EUROPEANA_ENTITY_API_KEY }),
        relatedEntities(params.type, params.pathMatch, { wskey: env.EUROPEANA_API_KEY })
      ])
        .then(axios.spread((entity, related) => {
          const desiredPath = getEntityPath(params.pathMatch, entity.entity.prefLabel.en);

          if (params.pathMatch !== desiredPath) {
            return redirect(302, '/entity/' + params.type + '/' + encodeURIComponent(desiredPath));
          }

          return {
            error: null,
            title: entity.entity.prefLabel.en,
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
        title: 'Entity'
      };
    }
  };
</script>
