<template>
  <div class="collections-page page">
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
      <template v-if="$features.aggregatorsTab && type === 'organisations'">
        <EntityOrganisationsTabs />
        <EntityOrganisationsPageContent />
      </template>
      <client-only v-else>
        <EntityTable
          :type="type"
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
      ContentHeader,
      ClientOnly,
      EntityOrganisationsPageContent: () => import('@/components/entity/EntityOrganisationsPageContent'),
      EntityOrganisationsTabs: () => import('@/components/entity/EntityOrganisationsTabs'),
      EntityTable: () => import('@/components/entity/EntityTable'),
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    mixins: [pageMetaMixin],

    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.type)) {
        this.$error(404, { scope: 'page' });
      }
    },

    computed: {
      type() {
        return this.$route.params.type;
      },
      description() {
        return this.type === 'organisations' ? this.$t('pages.collections.organisations.description') : null;
      },
      pageMeta() {
        return {
          title: this.$t(`pages.collections.${this.type}.title`),
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
      padding-bottom: 7rem;
    }
  </style>
