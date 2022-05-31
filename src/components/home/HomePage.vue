<template>
  <div>
    <HomeHero />
    <StackedCardsSwiper
      :slides="swiperThemes"
    />
  </div>
</template>

<script>
  import { getEntityTypeHumanReadable, getEntitySlug  } from '@/plugins/europeana/entity';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';
  import allThemes from '@/mixins/allThemes';
  import HomeHero from './HomeHero';
  import StackedCardsSwiper from '@/components/generic/StackedCardsSwiper';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      StackedCardsSwiper
    },

    mixins: [allThemes],

    async fetch() {
      await this.fetchAllThemes();
    },

    computed: {
      swiperThemes() {
        return this.allThemes.map(theme => {
          return { title: theme.prefLabel[this.$i18n.locale],
                   description: theme.description[this.$i18n.locale],
                   url: this.linkGen(theme) };
        });
      }
    },

    methods: {
      linkGen(collection) {
        const uriMatch = collection.id?.match(`^${EUROPEANA_DATA_URL}/([^/]+)(/base)?/(.+)$`);
        if (!uriMatch) {
          return null;
        }

        return this.$path({
          name: 'collections-type-all', params: {
            type: getEntityTypeHumanReadable(uriMatch[1]),
            pathMatch: getEntitySlug(collection.id, collection.prefLabel.en)
          }
        });
      }
    }
  };

</script>
