<template>
  <div
    class="home page white-page xxl-page"
    data-qa="home page"
  >
    <HomeHero
      :background-image="backgroundImage"
    />
    <client-only>
      <b-container class="page">
        <HomeThemes />
        <CallToActionBanner
          v-if="callsToAction[0]"
          :name="callsToAction[0].name"
          :text="callsToAction[0].text"
          :link="callsToAction[0].relatedLink"
          :illustration="callsToAction[0].image"
          variant="innovationblue"
          class="home-cta"
        />
        <HomeLatestStories />
        <CallToActionBanner
          v-if="callsToAction[1]"
          :name="callsToAction[1].name"
          :text="callsToAction[1].text"
          :link="callsToAction[1].relatedLink"
          :illustration="callsToAction[1].image"
          class="home-cta"
        />
        <HomeLatestGalleries />
      </b-container>
    </client-only>
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';
  import CallToActionBanner from '@/components/generic/CallToActionBanner';
  import HomeHero from '@/components/home/HomeHero';
  import HomeLatestStories from '@/components/home/HomeLatestStories';
  import HomeThemes from '@/components/home/HomeThemes';
  import HomeLatestGalleries from '@/components/home/HomeLatestGalleries';

  export default {
    name: 'HomePage',

    components: {
      CallToActionBanner,
      HomeHero,
      HomeLatestGalleries,
      HomeLatestStories,
      HomeThemes
    },

    mixins: [pageMetaMixin],

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
        this.sections = homePage.sectionsCollection.items.filter((item) => !!item);
        this.backgroundImage = homePage.primaryImageOfPage;
        this.socialMediaImage = homePage.image;
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .page {
    margin-top: 0;
    padding-bottom: 1px;
    text-align: center;

    &.container {
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
