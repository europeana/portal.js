<template>
  <b-table
    :fields="fields"
    :items="organisations"
    :sort-by.sync="sortBy"
  >
    <template #cell(nameid)="data">
      <b-link
        :href="$path(entityRoute(data.item))"
      >
        <span>
          {{ entityName(data.item.prefLabel) }}
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
      },
      entityRoute: {
        type: Function,
        default: () => null
      }
    },
    data() {
      return {
        sortBy: 'nameid',
        fields: [
          { key: 'nameid',
            sortable: true,
            formatter: (value, key, item) => item.prefLabel.en || item.prefLabel[Object.keys(item.prefLabel)[0]],
            sortByFormatted: true,
            label: 'Name' }
        ]
      };
    },
    computed: {
      organisations() {
        if (this.organisationEntities) {
          return Object.keys(this.organisationEntities).map(organisationId => {
            const organisationObject = this.organisationEntities[organisationId];
            return { prefLabel: organisationObject.prefLabel, id: organisationId, type: 'organisation' };
          });
        }
        return null;
      }
    },
    methods: {
      entityName(prefLabel) {
        return prefLabel.en || prefLabel[Object.keys(prefLabel)[0]];
      }
    }
  };
</script>
