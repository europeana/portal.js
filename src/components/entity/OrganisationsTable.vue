<template>
  <b-table
    :fields="fields"
    :items="entityNames"
    :sort-by.sync="sortBy"
  />
</template>

<script>

  export default {
    name: 'OrganisationsTable',
    props: {
      organisationEntities: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        sortBy: 'name',
        fields: [
          { key: 'name', sortable: true }
        ]
      };
    },
    computed: {
      entityNames() {
        if (this.organisationEntities) {
          return Object.values(this.organisationEntities).map(organisation => {
            return { name: organisation.prefLabel.en || organisation.prefLabel[Object.keys(organisation.prefLabel)[0]] };
          });
        }
        return null;
      }

    }
  };
</script>
