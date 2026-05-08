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
        v-if="['persons', 'places'].includes($route.params.type)"
      >
        <ContentHeader
          :title="pageMeta.title"
        />
        <EntityTypeBrowse
          :type="$route.params.type"
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
        <client-only>
          <EntityTable
            :type="$route.params.type"
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
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable'),
      EntityTypeBrowse: () => import('@/components/entity/EntityTypeBrowse')
    },

    mixins: [pageMetaMixin],

    data() {
      const pageMetaTitle = this.$t(`pages.collections.${this.$route.params.type}.title`);
      const pageMetaDescription = this.$te(`pages.collections.${this.$route.params.type}.description`) ?
        this.$t(`pages.collections.${this.$route.params.type}.description`) :
        null;

      return {
        pageMetaDescription,
        pageMetaTitle
      };
    },

    fetch() {
      if (!VALID_TYPE_PARAMS.includes(this.$route.params.type)) {
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
    }
  };
  </script>

  <style lang="scss" scoped>
    @import '@europeana/style/scss/variables';

    .collections-page {
      padding-bottom: 7rem;
    }
  </style>
