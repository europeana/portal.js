<template>
  <div>
    <HomeHero />
    <StackedCardsSwiper
      :slides="swiperThemes"
      :title="$t('collections.themes')"
    />
    <HomeLatest />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import HomeHero from './HomeHero';
  import HomeLatest from './HomeLatest';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      HomeLatest,
      StackedCardsSwiper
    },

    mixins: [allThemes, collectionLinkGen],

    async fetch() {
      await this.fetchAllThemes();
    },

    computed: {
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
