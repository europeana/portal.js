<template>
  <div class="collections-page white-page">
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error.message"
      :title-path="$fetchState.error.titlePath"
      :illustration-src="$fetchState.error.illustrationSrc"
    />
    <b-container
      v-else
    >
      <ContentHeader
        :title="pageTitle"
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
  import ContentHeader from '@/components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'CollectionsIndexPage',

    components: {
      ErrorMessage: () => import('@/components/generic/ErrorMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },
    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.$route.params.type)) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        const error = new Error('Unknown collection type');
        error.statusCode = 404;
        error.titlePath = 'errorMessage.pageNotFound.title';
        error.metaTitlePath = 'errorMessage.pageNotFound.metaTitle';
        error.illustrationSrc = require('@/assets/img/illustrations/il-page-not-found.svg');
        throw error;
      }
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle)
      };
    },
    computed: {
      pageTitle() {
        return this.$fetchState.error ? this.$t(this.$fetchState.error.metaTitlePath || 'error') : this.$t(`pages.collections.${this.$route.params.type}.title`);
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
