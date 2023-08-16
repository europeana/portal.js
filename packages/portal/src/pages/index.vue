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
      :error="$fetchState.error"
      :show-message="false"
    />
    <template
      v-else
    >
      <BrowsePage
        v-if="browsePage"
        :name="page.name"
        :headline="page.headline"
        :has-part-collection="page.hasPartCollection"
        :social-media-image-url="socialMediaImage ? socialMediaImageOptimisedUrl : null"
      />
      <StaticPage
        v-else-if="staticPage"
        :name="page.name"
        :description="page.description"
        :has-part-collection="page.hasPartCollection"
        :related-links="page.relatedLinks"
      />
      <LandingPage
        v-else-if="landingPage"
        :page="page"
      />
    </template>
  </div>
</template>

<script>
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import BrowsePage from '@/components/browse/BrowsePage';
  import StaticPage from '@/components/static/StaticPage';
  import LandingPage from '@/components/landing/LandingPage';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'IndexPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      BrowsePage,
      LandingPage,
      LoadingSpinner,
      StaticPage
    },

    mixins: [pageMetaMixin],

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
        landingPage: false,
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

      const response = await this.$contentful.query('browseLandingStaticPage', variables);
      const data = response.data.data;
      if ((data.staticPageCollection?.items?.length || 0) > 0) {
        this.page = data.staticPageCollection.items[0];
        this.staticPage = true;
      } else if ((data.browsePageCollection?.items?.length || 0) > 0) {
        this.page = data.browsePageCollection.items[0];
        this.browsePage = true;
      } else if ((data.landingPageCollection?.items?.length || 0) > 0) {
        this.page = data.landingPageCollection.items[0];
        this.landingPage = true;
      } else {
        this.$error(404, { scope: 'page' });
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.unformattedTitle,
          description: this.page.description,
          ogType: 'article',
          ogImage: this.socialMediaImage ? this.socialMediaImageOptimisedUrl : null,
          ogImageAlt: this.socialMediaImage ? this.socialMediaImageAlt : null
        };
      },
      socialMediaImage() {
        // use social media image if set in Contentful, else null
        return this.page.image || this.primaryImageOfPage?.image || null;
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
      // Remove brackets added for special markup landing page
      unformattedTitle() {
        return this.page.name?.replaceAll(new RegExp('{{|}}', 'g'), '');
      }
    }
  };
</script>
