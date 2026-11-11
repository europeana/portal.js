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
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'NetworkMembersPage',

    components: {
      AlertMessage: () => import('@/components/generic/AlertMessage'),
      ContentHeader,
      LoadingSpinner
    },

    mixins: [
      pageMetaMixin
    ],

    data() {
      return {
        name: null,
        description: null,
        socialMediaImage: null
      };
    },

    async fetch() {
      const variables = {
        identifier: 'network/members',
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      const response = await this.$contentful.query(staticPageGraphql, variables);
      const pageEntry = response?.data?.staticPageCollection?.items?.[0];

      if (pageEntry) {
        this.name = pageEntry.name;
        this.description = pageEntry.description;
        this.socialMediaImage = pageEntry.image;
      } else {
        throw new Error('Not Found');
      }
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
