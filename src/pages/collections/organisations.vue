<template>
  <b-container>
    <ContentHeader
      :title="title"
    />
    <OrganisationsTable
      :organisation-entities="entities"
    />
  </b-container>
</template>
<script>
  import axios from 'axios';

  import ContentHeader from '../../components/generic/ContentHeader';

  export default {
    name: 'OrganisationsPage',
    components: {
      ContentHeader,
      OrganisationsTable: () => import('../../components/entity/OrganisationsTable')
    },
    asyncData({ error, app }) {
      return axios.get(
        `${app.$config.app.baseUrl}/_api/entities/organisations`
      )
        .then(response => response.data)
        .then(data => {
          return {
            entities: data,
            title: app.i18n.t('pages.collections.organisations.title')
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.title)
      };
    },
    watchQuery: ['page']
  };
  </script>
