<template>
  <div>
    <HomeHero />
    <StackedCardsSwiper
      v-if="!$fetchState.pending"
      :slides="swiperThemes"
      :title="$t('collections.themes')"
    />
  </div>
</template>

<script>
  import allThemes from '@/mixins/allThemes';
  import collectionLinkGen from '@/mixins/collectionLinkGen';
  import HomeHero from './HomeHero';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
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
