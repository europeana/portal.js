<template>
  <div class="organisations-page">
    <b-container>
      <ContentHeader
        :title="$t(`pages.collections.${this.$route.params.type}.title`)"
      />
      <client-only>
        <EntityTable
          :type="$route.params.type"
        />
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';

  export default {
    components: {
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.$t(`pages.collections.${this.$route.params.type}.title`))
      };
    },
    watchQuery: ['page']
  };
  </script>

  <style lang="scss" scoped>
    @import '@/assets/scss/variables.scss';
    .organisations-page {
      background-color: $white;
      margin-top: -3rem;
      padding: 3rem 0 7rem
    }
  </style>
