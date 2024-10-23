<template>
  <div>
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
      <LandingPage
        v-if="landingPage"
        :headline="page.headline || page.name"
        :text="page.text"
        :cta="page.relatedLink"
        :cta-help-text="page.relatedLinkDescription"
        :sections="page.hasPartCollection?.items.filter((item) => !!item)"
        :primary-image-of-page="page.primaryImageOfPage"
      />
      <HomePage
        v-else-if="homePage"
      />
      <BrowsePage
        v-else-if="browsePage"
        :name="page.name"
        :headline="page.headline"
        :has-part-collection="page.hasPartCollection"
        :image-url="pageMetaOgImage"
      />
      <StaticPage
        v-else-if="staticPage"
        :name="page.name"
        :description="page.description"
        :automated-translation="page.automatedTranslation"
        :has-part-collection="page.hasPartCollection"
        :related-links="page.relatedLinks"
      />
    </template>
  </div>
</template>

<script>
  import LoadingSpinner from '@/components/generic/LoadingSpinner';
  import pageMetaMixin from '@/mixins/pageMeta';
  import landingPageMixin from '@/mixins/landingPage';

  const ds4chLayout = (ctx) => landingPageMixin.methods.landingPageIdForRoute(ctx) === 'ds4ch';
  const landingLayout = (ctx) => landingPageMixin.methods.landingPageIdForRoute(ctx) === 'apis';

  export default {
    name: 'IndexPage',

    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      BrowsePage: () => import('@/components/browse/BrowsePage'),
      HomePage: () => import('@/components/home/HomePage'),
      LandingPage: () => import('@/components/landing/LandingPage'),
      LoadingSpinner,
      StaticPage: () => import('@/components/static/StaticPage')
    },

    mixins: [landingPageMixin, pageMetaMixin],

    layout(ctx) {
      if (ds4chLayout(ctx)) {
        return 'ds4ch';
      } else {
        return landingLayout(ctx) ? 'landing' : 'default';
      }
    },

    data() {
      return {
        browsePage: false,
        homePage: false,
        identifier: this.$route.params.pathMatch,
        landingPage: false,
        page: {},
        socialMediaImageAlt: null,
        socialMediaImage: null,
        staticPage: false
      };
    },

    async fetch() {
      if (!this.identifier) {
        if (this.$config?.app?.homeLandingPageSlug) {
          this.identifier = this.$config.app.homeLandingPageSlug;
          this.landingPage = true;
          this.homePage = true;
        } else {
          this.homePage = true;
          // HomePage component fetches itself
          return;
        }
      // TODO: make LandingPage fetch itself
      } else if (this.landingPageId) {
        this.landingPage = true;
      }

      try {
        await this.fetchContentfulEntry();
      } catch (e) {
        if (e.message === 'Not Found') {
          this.$error(404, { scope: 'page' });
        } else {
          throw (e);
        }
      }

      // use social media image if set in Contentful,
      // landing pages use primaryImageOfPage as a fallback, otherwise null
      this.socialMediaImage = this.page.image || this.page.primaryImageOfPage?.image || null;
      this.socialMediaImageAlt = this.socialMediaImage?.description || '';

      if (ds4chLayout({ $config: this.$config, route: this.$route })) {
        this.pageMetaSuffixTitle = null;
      }

      this.page = Object.freeze(this.page);
    },

    computed: {
      pageMeta() {
        return {
          title: this.page.name,
          description: this.page.description,
          ogType: this.homePage ? 'website' : 'article',
          ogImage: this.socialMediaImage,
          ogImageAlt: this.socialMediaImageAlt
        };
      }
    },

    methods: {
      async fetchContentfulEntry() {
        let ctfQuery = 'browseStaticPage';
        if (this.landingPage) {
          ctfQuery = 'landingPage';
        }

        const variables = {
          identifier: this.identifier,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query(ctfQuery, variables);
        const data = response.data.data;

        const entryCollection = Object.keys(data).find((key) => (data[key]?.items?.length || 0) > 0);
        if (entryCollection) {
          this.page = data[entryCollection].items[0];
          this[entryCollection.replace('Collection', '')] = true;
        } else {
          throw new Error('Not Found');
        }
      }
    }
  };
</script>
