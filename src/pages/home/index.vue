<template>
  <div>
    <div
      v-if="$features.newHomepage"
      class="page"
    >
      <HomeHero
        :background-image="backgroundImage"
      />
      <client-only>
        <div class="page gridless-container">
          <CallToActionBanner
            v-if="callsToAction[0]"
            :name="callsToAction[0].name"
            :text="callsToAction[0].text"
            :link="callsToAction[0].relatedLink"
            :illustration="callsToAction[0].image"
            variant="light"
            class="home-cta"
          />
          <StackedCardsSwiper
            v-if="swiperThemes.length > 0"
            :slides="swiperThemes"
            :title="$t('homePage.themesTitle')"
            :cta="{ url: $path('/collections'), text: $t('homePage.themesCTA') }"
          />
          <CallToActionBanner
            v-if="callsToAction[1]"
            :name="callsToAction[1].name"
            :text="callsToAction[1].text"
            :link="callsToAction[1].relatedLink"
            :illustration="callsToAction[1].image"
            variant="innovationblue"
            class="home-cta"
          />
          <HomeLatest />
          <CallToActionBanner
            v-if="callsToAction[2]"
            :name="callsToAction[2].name"
            :text="callsToAction[2].text"
            :link="callsToAction[2].relatedLink"
            :illustration="callsToAction[2].image"
            class="home-cta"
          />
        </div>
      </client-only>
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
  import { optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';

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
        socialMediaImage: null,
        // TODO: following four properties required when rendering IndexPage as
        //       a child component; remove when new home page is launched.
        browsePage: false,
        staticPage: false,
        page: {},
        identifier: null
      };
    },

    async fetch() {
      if (!this.$features.newHomepage) {
        return;
      }
      await this.fetchContentfulEntry();
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.pageTitle),
        meta: [
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'title', name: 'title', content: this.pageTitle },
          { hid: 'og:title', property: 'og:title', content: this.pageTitle },
          { hid: 'description', name: 'description', content: this.pageSubHeadline },
          { hid: 'og:description', property: 'og:description', content: this.pageSubHeadline },
          { hid: 'og:image', property: 'og:image', content: this.headMetaOgImage }
        ]
      };
    },

    computed: {
      pageTitle() {
        return this.$t('homePage.title');
      },

      pageSubHeadline() {
        return this.$t('homePage.subHeadline');
      },

      headMetaOgImage() {
        const image = this.socialMediaImage ? this.socialMediaImage : this.backgroundImage?.image;
        return optimisedSrcForContentfulAsset(image, { w: 1200, h: 630, fit: 'fill' });
      },

      callsToAction() {
        const ctas = this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
        if (ctas.length < 3) {
          ctas.unshift(null);
        }
        return ctas;
      },

      swiperThemes() {
        return this.allThemes.map(theme => ({
          title: theme.prefLabel[this.$i18n.locale],
          description: theme.description[this.$i18n.locale],
          url: this.collectionLinkGen(theme),
          image: theme.contentfulImage
        }));
      }
    },

    mounted() {
      if (!this.$features.newHomepage) {
        return;
      }

      this.fetchAllThemes();
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
        this.sections = homePage.sectionsCollection.items.filter((item) => !!item);
        this.backgroundImage = homePage.primaryImageOfPage;
        this.socialMediaImage = homePage.image;
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
    text-align: center;

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
