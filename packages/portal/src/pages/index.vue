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
      <HomePage
        v-if="homePage"
        :sections="page.sectionsCollection?.items.filter((item) => !!item)"
        :background-images="page.primaryImageSetOfPageCollection?.items?.[0]?.hasPartCollection?.items || []"
        :social-media-image="this.page.image"
      />
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
        :headline="page.headline || page.name"
        :text="page.text"
        :cta="page.relatedLink"
        :sections="page.hasPartCollection?.items.filter((item) => !!item)"
        :primary-image-of-page="page.primaryImageOfPage"
      />
    </template>
  </div>
</template>

<script>
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import BrowsePage from '@/components/browse/BrowsePage';
  import HomePage from '@/components/home/HomePage';
  import StaticPage from '@/components/static/StaticPage';
  import LandingPage from '@/components/landing/LandingPage';
  import pageMetaMixin from '@/mixins/pageMeta';
  import landingPageMixin from '@/mixins/landingPage';

  const ds4chLayout = ({ route, store }) => landingPageMixin.methods.landingPageIdForRoute({ route, store }) === 'ds4ch';

  export default {
    name: 'IndexPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      // TODO: dynamic imports
      BrowsePage,
      HomePage,
      LandingPage,
      LoadingSpinner,
      StaticPage
    },

    mixins: [landingPageMixin, pageMetaMixin],

    layout({ route, store }) {
      return ds4chLayout({ route, store }) ? 'ds4ch' : 'default';
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
        homeLandingPage: null,
        homePage: false,
        identifier: this.slug || this.$route.params.pathMatch,
        landingPage: false,
        page: {},
        staticPage: false
      };
    },

    async fetch() {
      this.homeLandingPage = this.$store.state.microsite.home;

      let ctfQuery = 'browseStaticPage';
      if (this.homeLandingPage) {
        this.identifier = this.homeLandingPage;
        this.homePage = false;
        this.landingPage = true;
      }
      if (this.homePage) {
        ctfQuery = 'homePage';
      }
      if (this.landingPage) {
        ctfQuery = 'landingPage';
      }


      const variables = {
        // TODO: make this work w/ home page specification by route query
        identifier: this.identifier,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        date: (new Date()).toISOString()
      };

      const response = await this.$contentful.query(ctfQuery, variables);
      const data = response.data.data;
      if ((data.homePageCollection?.items?.length || 0) > 0) {
        this.page = data.homePageCollection.items[0];
      } else if ((data.staticPageCollection?.items?.length || 0) > 0) {
        this.page = data.staticPageCollection.items[0];
        this.staticPage = true;
      } else if ((data.browsePageCollection?.items?.length || 0) > 0) {
        this.page = data.browsePageCollection.items[0];
        this.browsePage = true;
      } else if ((data.landingPageCollection?.items?.length || 0) > 0) {
        this.page = data.landingPageCollection.items[0];
      } else {
        this.$error(404, { scope: 'page' });
      }
    },

    computed: {
      pageMeta() {
        return {
          title: this.page.name,
          description: this.page.description,
          ogType: 'article',
          ogImage: this.socialMediaImage ? this.socialMediaImageOptimisedUrl : null,
          ogImageAlt: this.socialMediaImage ? this.socialMediaImageAlt : null
        };
      },
      socialMediaImage() {
        // use social media image if set in Contentful,
        // landing pages use primaryImageOfPage as a fallback, otherwise null
        return this.page.image || this.page.primaryImageOfPage?.image || null;
      },
      socialMediaImageOptimisedUrl() {
        return this.$contentful.assets.optimisedSrc(
          this.socialMediaImage,
          { w: 800, h: 800 }
        );
      },
      socialMediaImageAlt() {
        return this.socialMediaImage?.description || '';
      }
    },

    created() {
      if (!this.identifier) {
        this.homePage = true;
      }
      if (this.landingPageId) {
        this.landingPage = true;
      }

      if (ds4chLayout({ route: this.$route, store: this.$store })) {
        this.pageMetaSuffixTitle = null;
      }
    }
  };
</script>
