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
    <h1 data-qa="entity title">
      {{ title }}
    </h1>
  </b-container>
</template>

<script>
  import AlertMessage from '../../../components/generic/AlertMessage';

  import getEntity from '../../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage
    },
    data () {
      return {
        error: null,
        title: null
      };
    },
    asyncData ({ env, params, res }) {
      return getEntity(params.type, params.pathMatch, {
        wskey: env.EUROPEANA_ENTITY_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            error: response.error,
            title: response.entity.prefLabel.en
          };
        })
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
