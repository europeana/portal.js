<template>
  <div
    data-qa="browse page"
    :class="browseClass"
  >
    <NotificationBanner
      v-if="showNotificationBanner"
      :notification-url="notificationUrl"
      :notification-text="$t('linksToClassic.home.text')"
      :notification-link-text="$t('linksToClassic.home.linkText')"
      class="mb-3"
    />
    <HeroHeader
      v-if="heroImage"
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
      showNotificationBanner() {
        return this.$config.app.features.linksToClassic && (this.identifier === 'home');
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
      },
      heroCta() {
        return this.hero && this.hero.link ? this.hero.link : null;
      },
      heroTitle() {
        return this.hero && this.hero.title ? this.hero.title : null;
      },
      heroDescription() {
        return this.hero && this.hero.headline ? this.hero.headline : null;
      },
      browseClass() {
        return this.$exp.name === 'background-color-main' ? this.$exp.$classes.join(' ') : '';
      }
    },

    head() {
      return {
        title: this.name + this.$pageHeadTitle(),
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
