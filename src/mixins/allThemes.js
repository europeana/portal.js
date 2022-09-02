import { mapState } from 'vuex';
import { getEntityUri  } from '@/plugins/europeana/entity';
import themes, { withEditorialContent } from '@/plugins/europeana/themes';

export default {
  computed: {
    ...mapState({ allThemes: state => state.search.allThemes })
  },

  methods: {
    async fetchAllThemes() {
      if (this.allThemes.length === 0) {
        const themesForStore = await withEditorialContent(this, themes.map((theme) => {
          return { id: getEntityUri('topic', theme.id) };
        }));
        this.$store.commit('search/set', ['allThemes', themesForStore]);
      }
    }
  }
};
