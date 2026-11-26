<template>
  <div class="page browse-page-4-col xxl-page">
    <nav :aria-label="$t('breadcrumb')">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <SmartLink destination="/network">
            {{ $t('pages.enaMembers.ena') }}
          </SmartLink>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
        >
          {{ $t('pages.enaMembers.directory') }}
        </li>
      </ol>
    </nav>
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
          class="col-xl-10"
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
              id="members-table"
              :items="people"
              :total-results="total"
              :per-page="perPage"
              :countries="countries"
              :communities="communities"
              :options-fetched="{ country: countryOptionsFetched, communities: communitiesOptionsFetched }"
              @showDropdown="fetchOptions"
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
  import SmartLink from '@/components/generic/SmartLink';
  import staticPageGraphql from '@/graphql/queries/staticPage.graphql';
  import contactsGraphql  from '@/graphql/queries/contacts.graphql';
  import contactsCommunitiesGraphql  from '@/graphql/queries/contactsCommunities.graphql';
  import contactsCountriesGraphql  from '@/graphql/queries/contactsCountries.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';
  import PersonTable from '../../components/person/PersonTable.vue';
  import useScrollTo from '@/composables/scrollTo.js';

  const PER_PAGE = 20;

  export default {
    name: 'NetworkMembersPage',

    components: {
      ContentHeader,
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      LoadingSpinner,
      PersonTable,
      SmartLink
    },

    mixins: [
      pageMetaMixin
    ],

    setup() {
      const { scrollToSelector } = useScrollTo();
      return { scrollToSelector };
    },

    data() {
      return {
        name: null,
        description: null,
        socialMediaImage: null,
        pageFetched: false,
        total: null,
        people: null,
        perPage: PER_PAGE,
        // TODO: countries translations
        countries: [],
        communities: [],
        countryOptionsFetched: false,
        communitiesOptionsFetched: false
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
      },
      countryQuery() {
        return this.$route.query.country;
      },
      communitiesQuery() {
        return this.$route.query.communities;
      },
      basePeopleQueryVariables() {
        return Object.entries({
          participation: ['Network Association'],
          communities: this.communitiesQuery?.split(','),
          country: this.countryQuery,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        }).reduce((memo, [key, value]) => value ? { ...memo, [key]: value } : memo, {});
      }
    },

    watch: {
      '$route.query.page': 'handlePageChanged',
      '$route.query.communities': 'handleFilterChange',
      '$route.query.country': 'handleFilterChange'
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
          ...this.basePeopleQueryVariables,
          skip: this.skip
        };

        const peopleResponse = await this.$contentful.query(contactsGraphql, variables);

        this.people = peopleResponse?.data?.zohoContactCollection?.items;
        this.total = peopleResponse?.data?.zohoContactCollection?.total;
      },
      resetFilterOptions() {
        this.countries = [];
        this.communities = [];
        this.countryOptionsFetched = false;
        this.communitiesOptionsFetched = false;
      },
      handleFilterChange() {
        this.resetFilterOptions();
        this.fetchPeople();
      },
      handlePageChanged() {
        this.scrollToSelector('#members-table', {
          behavior: 'smooth'
        });
        this.$fetch();
      },
      async fetchPaginatedOptions(name) {
        let query;
        let variables = this.basePeopleQueryVariables;

        if (name === 'country') {
          query = contactsCountriesGraphql;
          delete variables.country;
        } else if (name === 'communities') {
          query = contactsCommunitiesGraphql;
        }

        const limit = 1000;
        let skip = 0;
        let hasMore = true;
        let results = [];

        while (hasMore) {
          const response = await this.$contentful.query(query, {
            ...variables,
            limit,
            skip
          });

          const collection = response?.data?.zohoContactCollection;
          const items = collection?.items || [];
          const total = collection?.total || 0;

          results = results.concat(items.map(person => person[name]).flat().filter(Boolean));

          skip += limit;
          hasMore = total > skip;
        }

        return [...new Set(results)].sort((a, b) => a.localeCompare(b));
      },

      async fetchOptions(name) {
        if (name === 'country' && !this.countryOptionsFetched) {
          this.countries = await this.fetchPaginatedOptions('country');
          this.countryOptionsFetched = true;
        } else if (name === 'communities' && !this.communitiesOptionsFetched) {
          this.communities = await this.fetchPaginatedOptions('communities');
          this.communitiesOptionsFetched = true;
        }
      }

    }
  };
</script>
