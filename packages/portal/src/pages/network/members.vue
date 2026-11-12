<template>
  <div class="page text-page xxl-page">
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <b-container
      v-else-if="$fetchState.error"
      data-qa="alert message container"
    >
      <b-row class="flex-md-row py-4">
        <b-col cols="12">
          <AlertMessage
            :error="$fetchState.error.message"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-else
    >
      <b-row class="justify-content-center">
        <b-col
          cols="12"
          class="col-lg-8"
        >
          <article>
            <ContentHeader
              v-if="name"
              :title="name"
              :description="description"
              :media-url="pageMetaOgImage"
              button-variant="secondary"
              class="half-col"
            />
            <PersonTable
              v-if="people"
              :items="people"
              :total-results="total"
              :per-page="perPage"
            />
          </article>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '@/components/content/ContentHeader';
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import staticPageGraphql from '@/graphql/queries/staticPage.graphql';
  import peopleGraphql  from '@/graphql/queries/people.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';
  import PersonTable from '../../components/person/PersonTable.vue';

  const PER_PAGE = 20;

  export default {
    name: 'NetworkMembersPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      LoadingSpinner,
      PersonTable
    },

    mixins: [
      pageMetaMixin
    ],

    data() {
      return {
        name: null,
        description: null,
        socialMediaImage: null,
        fetchPage: true,
        total: null,
        people: null
      };
    },

    async fetch() {
      const pageVariables = {
        identifier: 'network/members',
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const peopleVariables = {
        // query: '', names have partial matching, emails only work as whole tokens
        participation: ['Network Association'],
        skip: this.skip,
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const [peopleResponse, pageResponse] = await Promise.all([
        this.$contentful.query(peopleGraphql, peopleVariables),
        this.fetchPage ? this.$contentful.query(staticPageGraphql, pageVariables) : undefined
      ]);

      if (this.fetchPage) {
        const pageEntry = pageResponse?.data?.staticPageCollection?.items?.[0];
        if (pageEntry) {
          this.name = pageEntry.name;
          this.description = pageEntry.description;
          this.socialMediaImage = pageEntry.image;
          this.fetchPage = false;
        } else {
          throw new Error('Not Found');
        }
      }

      this.people = peopleResponse?.data?.personCollection?.items;
      this.total = peopleResponse?.data?.personCollection?.total;
    },

    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogImage: this.socialMediaImage,
          ogImageAlt: this.socialMediaImage?.description
        };
      },
      skip() {
        return ((this.$route.query.page || 1) - 1) * this.perPage;
      },
      perPage() {
        return PER_PAGE;
      }
    },

    watch: {
      '$route.query.page': 'handleSearchParamsChanged'
      // '$route.query.query': 'handleSearchParamsChanged',
      // '$route.query.sort': 'handleSearchParamsChanged'
    },

    methods: {
      handleSearchParamsChanged() {
        // TODO: scroll to top?
        this.$fetch();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
</style>
