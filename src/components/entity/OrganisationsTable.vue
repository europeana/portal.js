<template>
  <b-table
    :fields="fields"
    :items="entityNames"
    :sort-by.sync="sortBy"
  />
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'OrganisationsTable',
    async fetch() {
      this.entities = await axios.get(
        `${this.$config.app.baseUrl}/_api/entities/organisations`
      )
        .then(response => response.data)
        .then(data => {
          return data;
        });
    },
    data() {
      return {
        entities: {},
        sortBy: 'name',
        fields: [
          { key: 'name', sortable: true }
        ]
      };
    },
    computed: {
      entityNames() {
        return Object.values(this.entities).map(organisation => {
          return { name: organisation.prefLabel.en || organisation.prefLabel[Object.keys(organisation.prefLabel)[0]] };
        });
      }
    }
  };
</script>
