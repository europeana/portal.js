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
        <ContentHeader />
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
  import pageMixin from '@/mixins/page';

  export default {
    name: 'CollectionsIndexPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },
    mixins: [pageMixin],
    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.$route.params.type)) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        this.$store.commit('page/setTitle', this.$t('error'));
        throw new Error('Unknown collection type');
      }
    },
    watch: {
      '$route': '$fetch'
    },
    watchQuery: ['page'],
    computed: {
      pageTitle() {
        return this.$t(`pages.collections.${this.$route.params.type}.title`);
      }
    }
  };
  </script>

  <style lang="scss" scoped>
    @import '@/assets/scss/variables';

    .collections-page {
      padding: 3rem 0 7rem;
    }
  </style>
