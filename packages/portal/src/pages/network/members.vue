<template>
  <div class="page text-page xxl-page">
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
      :show-message="false"
    />
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
      ContentHeader,
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
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
        pageFetched: false,
        total: null,
        people: null,
        perPage: PER_PAGE
      };
    },

    async fetch() {
      await Promise.all([
        this.fetchPage(),
        this.fetchPeople()
      ]);
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
      }
    },

    watch: {
      '$route.query.page': 'handleSearchParamsChanged'
      // '$route.query.communities': 'handleSearchParamsChanged',
      // '$route.query.country': 'handleSearchParamsChanged'
    },

    methods: {
      async fetchPage() {
        if (this.pageFetched) {
          return;
        }
        const variables = {
          identifier: 'network/members',
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };
        const pageResponse = await this.$contentful.query(staticPageGraphql, variables);
        const pageEntry = pageResponse?.data?.staticPageCollection?.items?.[0];
        if (pageEntry) {
          this.name = pageEntry.name;
          this.description = pageEntry.description;
          this.socialMediaImage = pageEntry.image;
          this.pageFetched = true;
        } else {
          this.$error(404, { scope: 'page' });
        }
      },
      async fetchPeople() {
        const variables = {
          participation: ['Network Association'],
          skip: this.skip,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };
        const peopleResponse = await this.$contentful.query(peopleGraphql, variables);

        this.people = peopleResponse?.data?.personCollection?.items;
        this.total = peopleResponse?.data?.personCollection?.total;
      },
      handleSearchParamsChanged() {
        this.$fetch();
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
</style>
