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
            />
            Total {{ total }}
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
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const [pageResponse, peopleResponse] = await Promise.all([
        this.$contentful.query(staticPageGraphql, pageVariables),
        this.$contentful.query(peopleGraphql, peopleVariables)
      ]);
      console.log(peopleResponse);
      const pageEntry = pageResponse?.data?.staticPageCollection?.items?.[0];
      if (pageEntry) {
        this.name = pageEntry.name;
        this.description = pageEntry.description;
        this.socialMediaImage = pageEntry.image;
      } else {
        throw new Error('Not Found');
      }

      this.people = peopleResponse?.data?.personCollection?.items;
      this.total = peopleResponse?.data?.personCollection?.total;
      // TODO: re-fetch people when criteria (filter/pagination/search) change
    },

    computed: {
      pageMeta() {
        return {
          title: this.name,
          description: this.description,
          ogImage: this.socialMediaImage,
          ogImageAlt: this.socialMediaImage?.description
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';
</style>
