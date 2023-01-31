<template>
  <div
    class="page white-page responsive-font"
    data-qa="home page"
  >
    <HomeHero
      :background-image="backgroundImage"
    />
    <client-only>
      <div class="page gridless-container">
        <StackedCardsSwiper
          v-if="swiperThemes.length > 0"
          :slides="swiperThemes"
          :title="$t('homePage.themesTitle')"
          :cta="{ url: $path('/collections'), text: $t('homePage.themesCTA') }"
        />
        <CallToActionBanner
          v-if="callsToAction[0]"
          :name="callsToAction[0].name"
          :text="callsToAction[0].text"
          :link="callsToAction[0].relatedLink"
          :illustration="callsToAction[0].image"
          variant="innovationblue"
          class="home-cta"
        />
        <HomeLatest />
        <CallToActionBanner
          v-if="callsToAction[1]"
          :name="callsToAction[1].name"
          :text="callsToAction[1].text"
          :link="callsToAction[1].relatedLink"
          :illustration="callsToAction[1].image"
          class="home-cta"
        />
      </div>
    </client-only>
  </div>
</template>

<script>
  import allThemesMixin from '@/mixins/allThemes';
  import pageMetaMixin from '@/mixins/pageMeta';
  import collectionLinkGenMixin from '@/mixins/collectionLinkGen';
  import CallToActionBanner from '@/components/generic/CallToActionBanner';
  import HomeHero from '@/components/home/HomeHero';
  import HomeLatest from '@/components/home/HomeLatest';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';
  import { langMapValueForLocale } from  '@/plugins/europeana/utils';

  export default {
    name: 'HomePage',

    components: {
      CallToActionBanner,
      HomeHero,
      HomeLatest,
      StackedCardsSwiper
    },

    mixins: [allThemesMixin, collectionLinkGenMixin, pageMetaMixin],

    data() {
      return {
        sections: [],
        backgroundImage: null,
        socialMediaImage: null
      };
    },

    async fetch() {
      await this.fetchContentfulEntry();
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('homePage.title', { digital: this.$t('homePage.titleDigital') }),
          description: this.pageSubHeadline,
          ogType: 'website',
          ogImage: this.headMetaOgImage
        };
      },

      pageSubHeadline() {
        return this.$t('homePage.subHeadline');
      },

      headMetaOgImage() {
        const image = this.socialMediaImage ? this.socialMediaImage : this.backgroundImage?.image;
        return this.$contentful.assets.optimisedSrc(image, { w: 1200, h: 630, fit: 'fill' });
      },

      callsToAction() {
        return this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
      },

      swiperThemes() {
        return this.allThemes.map(theme => ({
          title: langMapValueForLocale(theme.prefLabel, this.$i18n.locale).values[0],
          description: langMapValueForLocale(theme.description, this.$i18n.locale).values[0],
          url: this.collectionLinkGen(theme),
          image: theme.contentfulImage
        })).sort((a, b) => a.title.localeCompare(b.title));
      }
    },

    mounted() {
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
  @import '@/assets/scss/mixins';

  .page {
    margin-top: 0;
    padding-bottom: 1px;
    text-align: center;

    &.gridless-container {
      > div,
      > section {
        margin-bottom: 5.5rem;
      }

      .cta-banner {
        margin-bottom: calc(5.5rem + 0.75em);
      }
    }
  }
</style>
