<template>
  <div class="collections-page white-page">
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error.message"
      :status-code="$fetchState.error.statusCode"
    />
    <b-container
      v-else
    >
      <ContentHeader
        :title="pageMeta.title"
      />
      <client-only>
        <EntityTable
          :type="$route.params.type"
          data-qa="collections table"
        />
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ContentHeader from '@/components/generic/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'CollectionsIndexPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },

    mixins: [pageMetaMixin],

    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.$route.params.type)) {
        this.$error(404);
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t(`pages.collections.${this.$route.params.type}.title`)
        };
      }
    },
    watch: {
      '$route': '$fetch'
    },
    watchQuery: ['page']
  };
  </script>

  <style lang="scss" scoped>
    @import '@/assets/scss/variables';

    .collections-page {
      padding: 3rem 0 7rem;
    }
  </style>
