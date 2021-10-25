<template>
  <div class="organisations-page">
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
          :title="pageTitle"
        />
        <client-only>
          <EntityTable
            :type="$route.params.type"
          />
        </client-only>
      </template>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/generic/ContentHeader';
  import ClientOnly from 'vue-client-only';

  export default {
    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      ClientOnly,
      EntityTable: () => import('@/components/entity/EntityTable')
    },
    fetch() {
      if (!['organisations', 'topics', 'times'].includes(this.$route.params.type)) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        throw new Error('Unknown collection type');
      }
    },
    computed: {
      pageTitle() {
        return this.$fetchState.error ? 'Error' : this.$t(`pages.collections.${this.$route.params.type}.title`);
      }
    },
    watch: {
      '$route': '$fetch'
    },
    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle)
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
