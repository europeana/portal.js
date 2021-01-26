<template>
  <div data-qa="browse page">
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
      <BrowseSections :sections="hasPartCollection.items" />
    </b-container>
  </div>
</template>

<script>
  import ContentHeader from '../generic/ContentHeader';
  import BrowseSections from '../browse/BrowseSections';
  import HeroHeader from '../browse/HeroHeader';
  import NotificationBanner from '../generic/NotificationBanner.vue';

  export default {
    components: {
      ContentHeader,
      BrowseSections,
      NotificationBanner,
      HeroHeader
    },
    props: {
      identifier: {
        type: String,
        default: null
      },
      name: {
        type: String,
        default: null
      },
      headline: {
        type: String,
        default: null
      },
      description: {
        type: String,
        default: null
      },
      hasPartCollection: {
        type: Object,
        default: null
      },
      hero: {
        type: Object,
        default: null
      },
      heroImage: {
        type: Object,
        default: null
      }
    },
    computed: {
      showNotificationBanner() {
        return (
          this.$config.app.features.linksToClassic && this.identifier === 'home'
        );
      },
      notificationUrl() {
        return `https://classic.europeana.eu/portal/${
          this.$store.state.i18n.locale
        }?utm_source=new-website&utm_medium=button`;
      },
      heroCta() {
        return this.hero && this.hero.link ? this.hero.link : null;
      },
      heroTitle() {
        return this.hero && this.hero.title ? this.hero.title : null;
      },
      heroDescription() {
        return this.hero && this.hero.headline ? this.hero.headline : null;
      }
    }
  };
</script>
