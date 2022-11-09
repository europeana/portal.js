import { getEntityUri  } from '@/plugins/europeana/entity';
import themes, { withEditorialContent } from '@/plugins/europeana/themes';

export default {
  computed: {
    allThemes() {
      return this.$store.state.search.allThemes;
    }
  },

  methods: {
    async fetchAllThemes() {
      if (this.allThemes.length === 0) {
        const themesForStore = await withEditorialContent(this, themes.map((theme) => {
          return { id: getEntityUri('topic', theme.id) };
        }));
        this.$store.commit('search/setAllThemes', themesForStore);
      }
    }
  }
};
