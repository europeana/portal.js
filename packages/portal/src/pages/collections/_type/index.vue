<template>
  <div class="collections-page white-page">
    <b-container>
      <b-row
        v-if="$fetchState.error"
        class="flex-md-row py-4"
      >
        <b-col cols="12">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-col>
      </b-row>
      <template
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
      </template>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'CollectionsIndexPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },

    mixins: [pageMetaMixin],

    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.$route.params.type)) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        throw new Error('Unknown collection type');
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
