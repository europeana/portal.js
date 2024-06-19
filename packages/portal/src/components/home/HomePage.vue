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
          :name-english="callsToAction[0].nameEN"
          :text="callsToAction[0].text"
          :link="callsToAction[0].relatedLink"
          :illustration="callsToAction[0].image"
          :variant="callsToAction[2] ? 'light' : 'innovationblue'"
          class="home-cta"
        />
        <HomeLatestStories />
        <CallToActionBanner
          v-if="callsToAction[1]"
          :name="callsToAction[1].name"
          :name-english="callsToAction[1].nameEN"
          :text="callsToAction[1].text"
          :link="callsToAction[1].relatedLink"
          :illustration="callsToAction[1].image"
          :variant="callsToAction[2] ? 'innovationblue' : 'yellowgrey'"
          class="home-cta"
        />
        <HomeLatestGalleries />
        <CallToActionBanner
          v-if="callsToAction[2]"
          :name="callsToAction[2].name"
          :name-english="callsToAction[2].nameEN"
          :text="callsToAction[2].text"
          :link="callsToAction[2].relatedLink"
          :illustration="callsToAction[2].image"
          class="home-cta"
        />
      </b-container>
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import pageMetaMixin from '@/mixins/pageMeta';
  import CallToActionBanner from '@/components/generic/CallToActionBanner';
  import HomeHero from '@/components/home/HomeHero';
  import HomeLatestStories from '@/components/home/HomeLatestStories';
  import HomeThemes from '@/components/home/HomeThemes';
  import HomeLatestGalleries from '@/components/home/HomeLatestGalleries';
  import { optimisedContentfulImageUrl } from '@/utils/contentful/assets.js';

  export default {
    name: 'HomePage',

    components: {
      CallToActionBanner,
      ClientOnly,
      HomeHero,
      HomeLatestGalleries,
      HomeLatestStories,
      HomeThemes
    },

    mixins: [pageMetaMixin],

    data() {
      return {
        backgroundImage: null,
        callsToAction: [],
        sections: [],
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
          description: this.$t('homePage.subHeadline'),
          ogType: 'website',
          ogImage: optimisedContentfulImageUrl(
            this.socialMediaImage,
            { w: 1200, h: 630, fit: 'fill' }
          )
        };
      }
    },

    methods: {
      async fetchContentfulEntry() {
        const variables = {
          locale: this.$i18n.localeProperties.iso,
          preview: this.$route.query.mode === 'preview',
          identifier: this.$route.query.identifier || null,
          date: (new Date()).toISOString()
        };
        const response = await this.$contentful.query('homePage', variables);

        const homePage = response.data.data.homePageCollection.items[0];
        const backgroundImages = homePage.primaryImageSetOfPageCollection?.items?.[0]?.hasPartCollection?.items || [];
        this.sections = homePage.sectionsCollection.items.filter((item) => !!item);
        this.callsToAction = this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
        this.backgroundImage = this.selectRandomBackground(backgroundImages);
        this.socialMediaImage = homePage.image;
      },

      selectRandomBackground(images) {
        return images[Math.floor(Math.random() * images.length)] || null;
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
