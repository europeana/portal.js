<template>
  <div class="organisations-page">
    <b-container>
      <ContentHeader
        :title="$t('pages.collections.organisations.title')"
      />
      <client-only>
        <OrganisationsTable />
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import { BTable } from 'bootstrap-vue';
  import ContentHeader from '@/components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'OrganisationsPage',
    components: {
      BTable,
      ContentHeader,
      ClientOnly,
      OrganisationsTable: () => import('@/components/entity/OrganisationsTable')
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.$t('pages.collections.organisations.title'))
      };
    },
    watchQuery: ['page']
  };
  </script>

  <style lang="scss" scoped>
    @import '../../assets/scss/variables.scss';
    .organisations-page {
      background-color: $white;
      margin-top: -3rem;
      padding: 3rem 0 7rem
    }
  </style>
