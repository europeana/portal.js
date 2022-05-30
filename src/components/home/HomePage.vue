<template>
  <div>
    <HomeHero />
    <StackedCardsSwiper
      :slides="themes"
      :loop="false"
    />
    <StackedCardsSwiper
      :slides="themes"
    />
  </div>
</template>

<script>
  import HomeHero from './HomeHero';
  import { getEntityUri, getEntityTypeHumanReadable, getEntitySlug  } from '@/plugins/europeana/entity';
  import themes, { withEditorialContent } from '@/plugins/europeana/themes';
  import { mapState } from 'vuex';
  import { BASE_URL as EUROPEANA_DATA_URL } from '@/plugins/europeana/data';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      StackedCardsSwiper: () => import('../generic/StackedCardsSwiper')
    },

    async fetch() {
      if (this.allThemes.length === 0) {
        const themesForStore = await withEditorialContent(this, themes.map((theme) => {
          return { id: getEntityUri('topic', theme.id) };
        }));
        this.$store.commit('search/set', ['allThemes', themesForStore]);
      }
    },

    computed: {
      ...mapState({ allThemes: state => state.search.allThemes }),
      themes() {
        return this.allThemes.map(theme => {
          return { title: theme.prefLabel[this.$i18n.locale], url: this.linkGen(theme) };
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
