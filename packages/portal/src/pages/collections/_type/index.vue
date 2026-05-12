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
      <template
        v-if="['persons', 'places'].includes(type)"
      >
        <ContentHeader
          :title="pageMeta.title"
        />
        <EntityTypeBrowse
          :type="type"
        />
      </template>
      <template v-else>
        <!-- TODO: replace media URL when available or a default placeholder is implemented -->
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
      </template>
    </b-container>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import ContentHeader from '@/components/content/ContentHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  const VALID_TYPE_PARAMS = [
    'organisations',
    'persons',
    'places',
    'topics',
    'times'
  ];

  export default {
    name: 'CollectionsIndexPage',

    components: {
      ContentHeader,
      ClientOnly,
      EntityOrganisationsPageContent: () => import('@/components/entity/EntityOrganisationsPageContent'),
      EntityOrganisationsTabs: () => import('@/components/entity/EntityOrganisationsTabs'),
      EntityTable: () => import('@/components/entity/EntityTable'),
      EntityTypeBrowse: () => import('@/components/entity/EntityTypeBrowse'),
      ErrorMessage: () => import('@/components/error/ErrorMessage')
    },

    mixins: [pageMetaMixin],

    data() {
      const type = this.$route.params.type;
      const pageMetaTitle = this.$t(`pages.collections.${type}.title`);
      const pageMetaDescription = this.$te(`pages.collections.${type}.description`) ?
        this.$t(`pages.collections.${type}.description`) :
        null;

      return {
        pageMetaDescription,
        pageMetaTitle,
        type
      };
    },

    fetch() {
      if (!VALID_TYPE_PARAMS.includes(this.type)) {
        this.$error(404, { scope: 'page' });
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.pageMetaTitle,
          description: this.pageMetaDescription
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
