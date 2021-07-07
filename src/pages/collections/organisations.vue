<template>
  <b-container>
    <ContentHeader
      :title="$t('pages.collections.organisations.title')"
    />
    <client-only>
      <OrganisationsTable />
    </client-only>
  </b-container>
</template>
<script>
  import ContentHeader from '../../components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'OrganisationsPage',
    components: {
      ContentHeader,
      ClientOnly,
      OrganisationsTable: () => import('../../components/entity/OrganisationsTable')
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.$t('pages.collections.organisations.title'))
      };
    },
    watchQuery: ['page']
  };
  </script>
