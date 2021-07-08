<template>
  <div>
    <b-row
      v-if="$fetchState.error"
      class="flex-md-row py-4"
    >
      <b-col cols="12">
        <AlertMessage
          :error="$fetchState.error.message"
        />
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="organisations"
      :sort-by.sync="sortBy"
      :busy="$fetchState.pending"
    >
      <template #table-busy>
        <div class="text-center my-2">
          <LoadingSpinner />
          Loading...
        </div>
      </template>
      <template #cell(prefLabel)="data">
        <b-link
          :to="$path(entityRoute(data.item.slug))"
        >
          <span>
            {{ data.item.prefLabel }}
          </span>
        </b-link>
      </template>
    </b-table>
  </div>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import LoadingSpinner from '../../components/generic/LoadingSpinner';

  export default {
    name: 'OrganisationsTable',
    components: {
      LoadingSpinner,
      AlertMessage
    },
    fetch() {
      this.$axios.get(
        '/_api/entities/organisations',
        { params: { locale: this.$i18n.locale } }
      )
        .then(response => {
          this.organisations = response.data;
        });
    },
    data() {
      return {
        organisations: null,
        sortBy: 'prefLabel',
        fields: [
          {
            key: 'prefLabel',
            sortable: true,
            label: 'Name'
          }
        ]
      };
    },
    methods: {
      entityRoute(slug) {
        return {
          name: 'collections-type-all',
          params: {
            type: 'organisation',
            pathMatch: slug
          }
        };
      }
    }
  };
</script>
