<template>
  <div>
    <div
      v-if="$features.newHomepage"
      class="page"
    >
      <HomeHero />
      <HomeCallToAction
        v-if="callsToAction[0]"
        :name="callsToAction[0].name"
        :text="callsToAction[0].text"
        :link="callsToAction[0].relatedLink"
      />
      <StackedCardsSwiper
        v-if="!$fetchState.pending"
        :slides="swiperThemes"
        :title="$t('homePage.themesTitle')"
        :cta="$t('homePage.themesCTA')"
      />
      <HomeCallToAction
        v-if="callsToAction[1]"
        :name="callsToAction[1].name"
        :text="callsToAction[1].text"
        :link="callsToAction[1].relatedLink"
      />
      <HomeLatest />
      <HomeCallToAction
        v-if="callsToAction[2]"
        :name="callsToAction[2].name"
        :text="callsToAction[2].text"
        :link="callsToAction[2].relatedLink"
      />
    </div>
    <IndexPage
      v-else
    />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import HomeCallToAction from '@/components/home/HomeCallToAction';
  import HomeHero from '@/components/home/HomeHero';
  import HomeLatest from '@/components/home/HomeLatest';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';
  import { urlIsContentfulAsset, optimisedSrcForContentfulAsset } from '@/plugins/contentful-utils';

  export default {
    name: 'HomePage',

    components: {
      HomeCallToAction,
      HomeHero,
      HomeLatest,
      IndexPage: () => import('../index'),
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    data() {
      return {
        sections: []
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
                   imageCSSVars: this.responsiveContentfulImage(theme) };
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
      },

      responsiveContentfulImage(theme) {
        if (theme.contentfulImage && urlIsContentfulAsset(theme.contentfulImage.url)) {
          return {
            '--bg-img-small': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 245, h: 500, fit: 'fill' })}')`,
            '--bg-img-medium': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 260, h: 500, fit: 'fill' })}')`,
            '--bg-img-large': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 280, h: 500, fit: 'fill' })}')`,
            '--bg-img-xl': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 300, h: 500, fit: 'fill' })}')`,
            '--bg-img-xxl': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 350, h: 500, fit: 'fill' })}')`,
            '--bg-img-xxlup': `url('${optimisedSrcForContentfulAsset(theme.contentfulImage, { w: 700, h: 900, fit: 'fill' })}')`
          };
        }
      }

    }
  };

</script>

<style lang="scss" scoped>
  .page {
    background-color: white;
    padding-bottom: 1rem;
  }
</style>
