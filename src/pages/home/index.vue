<template>
  <div>
    <template
      v-if="$features.newHomepage"
    >
      <HomeHero />
      <StackedCardsSwiper
        :slides="swiperThemes"
        :title="$t('collections.themes')"
      />
    </template>
    <IndexPage
      v-else
    />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import HomeHero from '@/components/home/HomeHero';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      IndexPage: () => import('../index'),
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    async fetch() {
      if (!this.$features.newHomepage) {
        return;
      }
      await this.fetchAllThemes();
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
      swiperThemes() {
        return this.allThemes.map(theme => {
          return { title: theme.prefLabel[this.$i18n.locale],
                   description: theme.description[this.$i18n.locale],
                   url: this.collectionLinkGen(theme) };
        });
      }
    }
  };

</script>
