<template>
  <div
    class="page"
  >
    <HomeHero />
    <CallToAction
      v-if="callsToActions[0]"
      :name="callsToActions[0].name"
      :text="callsToActions[0].text"
      :link="callsToActions[0].relatedLink"
    />
    <StackedCardsSwiper
      :slides="swiperThemes"
      :title="$t('collections.themes')"
    />
    <CallToAction
      v-if="callsToActions[1]"
      :name="callsToActions[1].name"
      :text="callsToActions[1].text"
      :link="callsToActions[1].relatedLink"
    />
    <!-- TODO: insert latest editorial here -->
    <CallToAction
      v-if="callsToActions[2]"
      :name="callsToActions[2].name"
      :text="callsToActions[2].text"
      :link="callsToActions[2].relatedLink"
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
      CallToAction,
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    data() {
      return {
        sections: []
      };
    },

    // TODO: refactor to use Promise.all instead of two unrelated await calls
    async fetch() {
      const variables = {
        identifier: this.$route.query.identifier || null,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };
      const response = await this.$contentful.query('homePage', variables);
      const homePage = response.data.data.homePageCollection.items[0];
      this.sections = homePage.sectionsCollection.items;

      await this.fetchAllThemes();
    },

    computed: {
      callsToActions() {
        return this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
      },

      swiperThemes() {
        return this.allThemes.map(theme => ({
          title: theme.prefLabel[this.$i18n.locale],
          description: theme.description[this.$i18n.locale],
          url: this.collectionLinkGen(theme)
        }));
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
