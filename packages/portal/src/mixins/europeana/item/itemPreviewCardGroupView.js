export default {
  name: 'ItemPreviewCardGroupViewMixin',

  created() {
    this.setViewFromRouteQuery();
  },

  computed: {
    routeQueryView() {
      return this.$route.query.view;
    },
    view: {
      get() {
        return this.$store.getters['search/activeView'];
      },
      set(value) {
        this.$store.commit('search/setView', value);
      }
    }
  },

  watch: {
    routeQueryView: 'setViewFromRouteQuery'
  },

  methods: {
    setViewFromRouteQuery() {
      if (this.routeQueryView) {
        this.view = this.routeQueryView;
        this.$cookies?.set('searchResultsView', this.routeQueryView);
      }
    }
  }
};
