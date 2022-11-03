<template>
  <div :class="$fetchState.error && 'white-page'">
    <b-container
      v-if="$fetchState.pending"
      data-qa="loading spinner container"
    >
      <b-row class="flex-md-row py-4 text-center">
        <b-col cols="12">
          <LoadingSpinner />
        </b-col>
      </b-row>
    </b-container>
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :title-path="$fetchState.error.titlePath"
      :illustration-src="$fetchState.error.illustrationSrc"
    />
    <template
      v-else
    >
      <BrowsePage
        v-if="browsePage"
        :name="page.name"
        :headline="page.headline"
        :has-part-collection="page.hasPartCollection"
      />
      <StaticPage
        v-else-if="staticPage"
        :name="page.name"
        :description="page.description"
        :has-part-collection="page.hasPartCollection"
        :related-links="page.relatedLinks"
      />
    </template>
  </div>
</template>

<script>
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import BrowsePage from '@/components/browse/BrowsePage';
  import StaticPage from '@/components/static/StaticPage';

  export default {
    name: 'IndexPage',

    components: {
      ErrorMessage: () => import('@/components/generic/ErrorMessage'),
      BrowsePage,
      LoadingSpinner,
      StaticPage
    },

    props: {
      slug: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        browsePage: false,
        staticPage: false,
        page: {},
        identifier: this.slug || this.$route.params.pathMatch
      };
    },

    async fetch() {
      const variables = {
        identifier: this.identifier,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };

      const response = await this.$contentful.query('browseStaticPage', variables);
      const data = response.data.data;
      if ((data.staticPageCollection?.items?.length || 0) > 0) {
        this.page = data.staticPageCollection.items[0];
        this.staticPage = true;
      } else if ((data.browsePageCollection?.items?.length || 0) > 0) {
        this.page = data.browsePageCollection.items[0];
        this.browsePage = true;
      } else {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        const error = new Error(this.$t('messages.notFound'));
        error.statusCode = 404;
        error.titlePath = 'errorMessage.pageNotFound.title';
        error.metaTitlePath = 'errorMessage.pageNotFound.metaTitle';
        error.illustrationSrc = require('@/assets/img/illustrations/il-page-not-found.svg');

        throw error;
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle }
        ].concat(this.page.description ? [
          { hid: 'description', name: 'description', content: this.page.description },
          { hid: 'og:description', property: 'og:description', content: this.page.description }
        ] : []).concat(this.socialMediaImage ? [
          { hid: 'og:image', property: 'og:image', content: this.socialMediaImageOptimisedUrl },
          { hid: 'og:image:alt', property: 'og:image:alt', content: this.socialMediaImageAlt }
        ] : [])
      };
    },

    computed: {
      socialMediaImage() {
        // use social media image if set in Contentful, else null
        return this.page.image || null;
      },
      socialMediaImageOptimisedUrl() {
        return this.$contentful.assets.optimisedSrc(
          this.socialMediaImage,
          { w: 800, h: 800 }
        );
      },
      socialMediaImageAlt() {
        return this.socialMediaImage?.description || '';
      },
      pageTitle() {
        if (this.$fetchState.error) {
          return this.$t(this.$fetchState.error.metaTitlePath || 'error');
        }
        return this.page.name;
      }
    }
  };
</script>
