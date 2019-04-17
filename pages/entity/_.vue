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
  >
    Entity
    {{ fields }}
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';

  import getEntity from '../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage
    },
    data () {
      return {
        error: null,
        fields: null
      };
    },
    asyncData ({ env }) {
      return getEntity({
        query: '"http://data.europeana.eu/concept/base/43"',
        wskey: env.EUROPEANA_API_KEY
      })
        .then((response) => {
          return {
            ...response,
            fields: response.facets
          };
        })
        .catch((error) => {
          return { results: null, error: 'Error' + error };
        });
    },
    head () {
      return {
        title: 'Entity'
      };
    }
  };
</script>
