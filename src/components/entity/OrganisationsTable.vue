<template>
  <b-table
    :fields="fields"
    :items="entityNames"
    :sort-by.sync="sortBy"
  >
    <template #cell(nameid)="data">
      <b-link
        :href="`/collections/organisation/${data.item.id}`"
      >
        <span>
          {{ data.item.name }}
        </span>
      </b-link>
    </template>
  </b-table>
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
          { key: 'nameid',
            sortable: true,
            label: 'Name' }
        ]
      };
    },
    computed: {
      entityNames() {
        if (this.organisationEntities) {
          return Object.values(this.organisationEntities).map(organisation => {
            return { name: organisation.prefLabel.en || organisation.prefLabel[Object.keys(organisation.prefLabel)[0]],
                     id: organisation.id };
          });
        }
        return null;
      }

    }
  };
</script>
