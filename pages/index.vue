<template>
  <div
    data-qa="browse page"
  >
    <NotificationBanner
      v-if="onHomePage"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.home.text')"
      :notification-link-text="$t('linksToClassic.home.linkText')"
      class="mb-3"
    />
    <HeroHeader
      v-if="hero"
      :hero-image="heroImage"
      :title="heroTitle"
      :description="heroDescription"
      :cta="heroCta"
    />
    <b-container>
      <ContentHeader
        v-if="!hero"
        :title="name"
        :description="headline"
      />
      <BrowseSections
        :sections="hasPartCollection.items"
      />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../components/generic/ContentHeader';
  import BrowseSections from '../components/browse/BrowseSections';
  import HeroHeader from '../components/browse/HeroHeader';
  import NotificationBanner from '../components/generic/NotificationBanner.vue';

  export default {
    components: {
      ContentHeader,
      BrowseSections,
      NotificationBanner,
      HeroHeader
    },

    asyncData({ params, query, error, app }) {
      const variables = {
        identifier: params.pathMatch ? params.pathMatch : 'home',
        locale: app.i18n.isoLocale(),
        preview: query.mode === 'preview'
      };

      return app.$contentful.query('browsePage', variables)
        .then(response => response.data.data)
        .then(data => {
          if (data.browsePageCollection.items.length === 0) {
            error({ statusCode: 404, message: app.i18n.t('messages.notFound') });
            return;
          }

          return data.browsePageCollection.items[0];
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    computed: {
      hero() {
        return this.primaryImageOfPage ? this.primaryImageOfPage : null;
      },
      // TODO: Remove these typechecks after switch over to new hero headers.
      heroImage() {
        if (this.hero['__typename'] === 'ImageWithAttribution') {
          return this.hero;
        }
        return this.hero && this.hero.image ? this.hero.image.image : null;
      },
      heroCta() {
        if (this.hero['__typename'] === 'ImageWithAttribution') {
          return;
        }
        return this.hero && this.hero.link ? this.hero.link : null;
      },
      heroTitle() {
        if (this.hero['__typename'] === 'ImageWithAttribution') {
          return this.name;
        }
        return this.hero && this.hero.title ? this.hero.title : null;
      },
      heroDescription() {
        if (this.hero['__typename'] === 'ImageWithAttribution') {
          return this.headline;
        }
        return this.hero && this.hero.headline ? this.hero.headline : null;
      },
      onHomePage() {
        return Boolean(Number(process.env.ENABLE_LINKS_TO_CLASSIC)) && (this.identifier === 'home');
      },
      notificationUrl() {
        return `https://classic.europeana.eu/portal/${this.$store.state.i18n.locale}?utm_source=new-website&utm_medium=button`;
      },
      optimisedImageUrl() {
        // use social media image if set in Contentful, otherwise use hero image
        let img = this.image === null ? this.heroImage : this.image;
        return this.$options.filters.optimisedImageUrl(
          img.url,
          img.contentType,
          { width: 800, height: 800 }
        );
      }
    },

    head() {
      return {
        title: this.$t('homepageTitle') + this.$pageHeadTitle(),
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
