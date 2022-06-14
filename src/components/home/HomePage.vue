<template>
  <div
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
      :slides="swiperThemes"
      :title="$t('collections.themes')"
    />
    <HomeCallToAction
      v-if="callsToAction[1]"
      :name="callsToAction[1].name"
      :text="callsToAction[1].text"
      :link="callsToAction[1].relatedLink"
    />
    <!-- TODO: insert latest editorial here -->
    <HomeCallToAction
      v-if="callsToAction[2]"
      :name="callsToAction[2].name"
      :text="callsToAction[2].text"
      :link="callsToAction[2].relatedLink"
    />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import HomeCallToAction from './HomeCallToAction';
  import HomeHero from './HomeHero';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      HomeCallToAction,
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    data() {
      return {
        sections: []
      };
    },

    fetch() {
      return Promise.all([
        this.fetchContentfulEntry(),
        this.fetchAllThemes()
      ]);
    },

    computed: {
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
          url: this.collectionLinkGen(theme)
        }));
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
