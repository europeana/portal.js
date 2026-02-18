<template>
  <div>
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
        variant="pro"
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
  import browseLandingStaticPageGraphql from '@/graphql/queries/browseLandingStaticPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';

  const identifierForRoute = (ctx) => ctx.route?.params?.pathMatch || ctx.$config?.app?.homeLandingPageSlug;

  const landingLayout = (ctx) => ['apis', 'black-history-month'].includes(identifierForRoute(ctx));

  const layoutName = (ctx) => {
    if (landingLayout(ctx)) {
      return 'landing';
    } else {
      return 'default';
    }
  };

  export default {
    name: 'IndexPage',

    components: {
      BrowsePage: () => import('@/components/browse/BrowsePage'),
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      HomePage: () => import('@/components/home/HomePage'),
      LandingPage: () => import('@/components/landing/LandingPage'),
      LoadingSpinner,
      StaticPage: () => import('@/components/static/StaticPage')
    },

    mixins: [pageMetaMixin],

    layout(ctx) {
      return layoutName(ctx);
    },

    data() {
      return {
        browsePage: false,
        homePage: false,
        landingPage: false,
        page: {},
        socialMediaImageAlt: null,
        socialMediaImage: null,
        staticPage: false
      };
    },

    async fetch() {
      if (!this.$route.params.pathMatch) {
        if (this.identifier) {
          this.landingPage = true;
          this.homePage = true;
        } else {
          this.homePage = true;
          // HomePage component fetches itself
          return;
        }
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

      this.page = Object.freeze(this.page);
    },

    computed: {
      identifier() {
        return identifierForRoute({ route: this.$route, $config: this.$config });
      },

      layoutName() {
        return layoutName({ route: this.$route, $config: this.$config });
      },

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
        const variables = {
          identifier: this.identifier,
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview'
        };

        const response = await this.$contentful.query(browseLandingStaticPageGraphql, variables);
        const data = response.data;

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
