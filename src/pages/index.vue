<template>
  <div>
    <HomePage
      v-if="isNewHomePage"
    />
    <BrowsePage
      v-else-if="browsePage"
      :name="name"
      :headline="headline"
      :description="description"
      :has-part-collection="hasPartCollection"
      :hero="hero"
      :hero-image="heroImage"
    />
    <StaticPage
      v-else-if="staticPage"
      :name="name"
      :description="description"
      :has-part-collection="hasPartCollection"
      :related-links="relatedLinks"
      :hero="hero"
    />
  </div>
</template>

<script>
  import BrowsePage from '../components/browse/BrowsePage';
  import StaticPage from '../components/static/StaticPage';
  import HomePage from '../components/home/HomePage';

  export default {
    name: 'IndexPage',

    components: {
      BrowsePage,
      StaticPage,
      HomePage
    },

    asyncData({ params, query, error, app }) {
      if (!app.$features.newHomepage || (app.$features.newHomepage && params.pathMatch)) {
        const variables = {
          // TODO: clean up when new home is enabled
          identifier: params.pathMatch ? params.pathMatch : 'home',
          locale: app.i18n.isoLocale(),
          preview: query.mode === 'preview'
        };

        return app.$contentful.query('browseStaticPage', variables)
          .then(response => response.data.data)
          .then(data => {
            if (data.staticPageCollection.items.length > 0) {
              const itemData = data.staticPageCollection.items[0];
              itemData.staticPage = true;
              return itemData;
            } else if (data.browsePageCollection.items.length > 0) {
              const itemData = data.browsePageCollection.items[0];
              itemData.browsePage = true;
              return itemData;
            } else {
              error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
              return null;
            }
          })
          .catch((e) => {
            error({ statusCode: 500, message: e.toString() });
          });
      }
    },

    data() {
      return {
        browsePage: false,
        staticPage: false,
        identifier: null,
        name: null,
        headline: null,
        description: null,
        primaryImageOfPage: null,
        image: null,
        hasPartCollection: null,
        relatedLinks: null
      };
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.socialMediaImage ? [
          { hid: 'og:image', property: 'og:image', content: this.socialMediaImageOptimisedUrl },
          { hid: 'og:image:alt', property: 'og:image:alt', content: this.socialMediaImageAlt }
        ] : [])
      };
    },

    computed: {
      isNewHomePage() {
        return this.$features.newHomepage && !this.$route.params.pathMatch;
      },
      socialMediaImage() {
        // use social media image if set in Contentful, otherwise use hero image, else null
        return this.image || this.heroImage?.image || null;
      },
      socialMediaImageOptimisedUrl() {
        return this.$options.filters.optimisedImageUrl(this.socialMediaImage.url, this.socialMediaImage.contentType, {
          width: 800,
          height: 800
        });
      },
      socialMediaImageAlt() {
        return this.socialMediaImage.description ? this.socialMediaImage.description : '';
      },
      hero() {
        return this.primaryImageOfPage ? this.primaryImageOfPage : null;
      },
      heroImage() {
        return this.hero?.image || null;
      },
      pageTitle() {
        return this.isNewHomePage ? this.$t('homePage.title') : this.name;
      }
    }
  };
</script>
