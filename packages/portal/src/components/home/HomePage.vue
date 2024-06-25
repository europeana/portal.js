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
        <HomeLatestStories
          class="home-page-card-group"
        />
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
        <HomeLatestGalleries
          class="home-page-card-group"
        />
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
          ogImage: this.socialMediaImage,
          ogType: 'website'
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

  .home-page-card-group ::v-deep {

    @media (min-width: $bp-wqhd) {
      width: fit-content;
      max-width: calc(4 * (#{$max-card-width} + #{$grid-gutter * 2}));
      margin-left: auto;
      margin-right: auto;
    }

    @media (min-width: $bp-4k) {
      max-width: calc(4 * (#{$max-card-width} + #{$grid-gutter-4k * 2}));
    }

    .card:not(.mosaic-item) {

      @media (min-width: ($bp-wqhd)) {
        flex: 0 0 calc(100% / 4 - #{$grid-gutter * 2});
      }

      @media (min-width: ($bp-4k)) {
        flex: 0 0 calc(100% / 4 - #{$grid-gutter-4k * 2});
      }
    }

    h2.card-group-title {
      color: $mediumgrey;
      font-size: 2rem;
      font-weight: 400;
      text-align: center;
      margin-bottom: 0;

      @media (min-width: $bp-extralarge) {
        font-size: $font-size-xxl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xxl-4k;
      }
    }

    .card-deck {
      flex-flow: row wrap;
      justify-content: center;
      margin-top: 2.25rem;
      margin-bottom: 2.25rem;

      @media (min-width: $bp-4k) {
        margin-top: calc( 1.5 * 2.25rem);
        margin-bottom: calc( 1.5 * 2.25rem);
      }

      .content-card.card {
        @media (max-width: ($bp-medium - 1px)) {
          &:last-child {
            margin-bottom: 0;
          }
        }

        @media (min-width: $bp-large) {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
