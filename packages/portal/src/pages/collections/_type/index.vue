<template>
  <div class="collections-page">
    <ErrorMessage
      v-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <b-container
      v-else
    >
      <!-- Replace media URL when available or a default placeholder is implemented -->
      <ContentHeader
        :title="pageMeta.title"
        :description="pageMeta.description"
        :media-url="'/'"
        button-variant="secondary"
        class="half-col"
      />
      <client-only>
        <EntityTable
          :type="$route.params.type"
          data-qa="collections table"
          class="mt-3 mt-md-4"
        />
      </client-only>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ContentHeader from '@/components/content/ContentHeader';
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
        this.$error(404, { scope: 'page' });
      }
    },

    computed: {
      description() {
        return this.$route.params.type === 'organisations' ? this.$t('pages.collections.organisations.description') : null;
      },
      pageMeta() {
        return {
          title: this.$t(`pages.collections.${this.$route.params.type}.title`),
          description: this.description
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
    @import '@europeana/style/scss/variables';

    .collections-page {
      padding: 3rem 0 7rem;
    }
  </style>
