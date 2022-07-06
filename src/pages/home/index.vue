<template>
  <div>
    <div
      v-if="$features.newHomepage"
      class="page"
    >
      <HomeHero
        :background-image="backgroundImage"
      />
      <CallToActionBanner
        v-if="callsToAction[0]"
        :name="callsToAction[0].name"
        :text="callsToAction[0].text"
        :link="callsToAction[0].relatedLink"
      />
      <StackedCardsSwiper
        v-if="!$fetchState.pending"
        :slides="swiperThemes"
        :title="$t('homePage.themesTitle')"
        :cta="{ url: $path('/collections'), text: $t('homePage.themesCTA') }"
      />
      <CallToActionBanner
        v-if="callsToAction[1]"
        :name="callsToAction[1].name"
        :text="callsToAction[1].text"
        :link="callsToAction[1].relatedLink"
      />
      <HomeLatest />
      <CallToActionBanner
        v-if="callsToAction[2]"
        :name="callsToAction[2].name"
        :text="callsToAction[2].text"
        :link="callsToAction[2].relatedLink"
      />
    </div>
    <IndexPage
      v-else
      slug="home"
    />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import CallToActionBanner from '@/components/generic/CallToActionBanner';
  import HomeHero from '@/components/home/HomeHero';
  import HomeLatest from '@/components/home/HomeLatest';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      CallToActionBanner,
      HomeHero,
      HomeLatest,
      IndexPage: () => import('../index'),
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    data() {
      return {
        sections: [],
        backgroundImage: null,
        // TODO: following four properties required when rendering IndexPage as
        //       a child component; remove when new home page is launched.
        browsePage: false,
        staticPage: false,
        page: {},
        identifier: null
      };
    },

    fetch() {
      if (!this.$features.newHomepage) {
        return Promise.resolve();
      }
      return Promise.all([
        this.fetchContentfulEntry(),
        this.fetchAllThemes()
      ]);
    },

    head() {
      // TODO: add description, social media image, etc
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle }
        ]
      };
    },

    computed: {
      pageTitle() {
        // TODO: read this from CTF home page content entry instead?
        return this.$t('homePage.title');
      },

      callsToAction() {
        const ctas = this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
        if (ctas.length < 3) {
          ctas.unshift(null);
        }
        return ctas;
      },

      swiperThemes() {
        return this.allThemes.map(theme => {
          return { title: theme.prefLabel[this.$i18n.locale],
                   description: theme.description[this.$i18n.locale],
                   url: this.collectionLinkGen(theme),
                   image: theme.contentfulImage };
        });
      }
    },

    methods: {
      async fetchContentfulEntry() {
        const variables = {
          locale: this.$i18n.isoLocale(),
          preview: this.$route.query.mode === 'preview',
          identifier: this.$route.query.identifier || null,
          date: (new Date()).toISOString()
        };
        const response = await this.$contentful.query('homePage', variables);
        const homePage = response.data.data.homePageCollection.items[0];
        this.sections = homePage.sectionsCollection.items;
        this.backgroundImage = homePage.primaryImageOfPage;
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .page {
    background-color: white;
    padding-bottom: 1rem;
    position: relative;

    &::after {
      border-top: 145px solid $white;
      border-left: 60px solid transparent;
      content: '';
      display: block;
      height: 0;
      position: absolute;
      right: 0;
      top: 100%;
      width: 0;
      z-index: 1;
    }
  }
</style>
