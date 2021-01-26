<template>
  <div>
    <BrowsePage
      v-if="browsePage"
      :identifier="identifier"
      :name="name"
      :headline="headline"
      :description="description"
      :primary-image-of-page="primaryImageOfPage"
      :image="image"
      :has-part-collection="hasPartCollection"
      :hero="hero"
      :hero-image="heroImage"
    />
    <StaticPage
      v-if="staticPage"
      :identifier="identifier"
      :name="name"
      :description="description"
      :primary-image-of-page="primaryImageOfPage"
      :image="image"
      :has-part-collection="hasPartCollection"
      :related-links="relatedLinks"
      :hero="hero"
    />
  </div>
</template>

<script>
  import BrowsePage from '../components/browse/BrowsePage';
  import StaticPage from '../components/static/StaticPage';

  export default {
    components: {
      BrowsePage,
      StaticPage
    },

    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch ? params.pathMatch : 'home',
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('browseStaticPage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.staticPageCollection.items.length > 0) {
            let itemData = data.staticPageCollection.items[0];
            itemData.staticPage = true;
            return itemData;
          } else if (data.browsePageCollection.items.length > 0) {
            let itemData = data.browsePageCollection.items[0];
            itemData.browsePage = true;
            return itemData;
          } else if (data.browsePageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
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

    computed: {
      optimisedImageUrl() {
        console.log(this.image, this.hero.image.url);
        // use social media image if set in Contentful, otherwise use hero image
        let img = this.image === null ? this.heroImage : this.image;
        return this.$options.filters.optimisedImageUrl(img.url, img.contentType, {
          width: 800,
          height: 800
        });
      },
      hero() {
        return this.primaryImageOfPage ? this.primaryImageOfPage : null;
      },
      heroImage() {
        let heroImage = null;

        if (this.hero && this.hero.image && this.hero.image.image) {
          heroImage = this.hero.image;
        }

        return heroImage;
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.name),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.name },
          { hid: 'og:title', property: 'og:title', content: this.name }
        ].concat(this.description ? [
          { hid: 'description', name: 'description', content: this.description },
          { hid: 'og:description', property: 'og:description', content: this.description }
        ] : []).concat(this.heroImage ? [
          { hid: 'og:image', property: 'og:image', content: this.optimisedImageUrl }
        ] : [])
      };
    }
  };
</script>
