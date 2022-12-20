export default {
  data() {
    return {
      paginationFocusRefName: 'pagination-focus',
      paginationFocusRefUid: null,
      paginationFocusEnabled: true,
      // TODO: it's nicer to scroll before focusing, but there are issues when
      //       Masonry layout is used
      paginationFocusScrollEnabled: false,
      paginationFocusScrollTo: '#header'
    };
  },

  mounted() {
    this.focusFirstPaginatedElementLink();
  },

  updated() {
    this.focusFirstPaginatedElementLink();
  },

  methods: {
    async focusFirstPaginatedElementLink() {
      if (!this.paginationFocusEnabled) {
        return;
      }

      const refs = this.$refs[this.paginationFocusRefName];
      const ref = Array.isArray(refs) ? refs[0] : ref;

      if (ref) {
        if (this.paginationFocusRefUid !== ref['_uid']) {
          await this.$nextTick();
          this.paginationFocusRefUid = ref['_uid'];
          const link = ref.$el?.getElementsByTagName('a')?.[0];
          if (this.paginationFocusScrollEnabled && this.$scrollTo) {
            this.$scrollTo(this.paginationFocusScrollTo, { cancelable: false, onDone: () => link?.focus() });
          } else {
            link?.focus();
          }
        }
      } else {
        this.paginationFocusRefUid = null;
      }
    }
  }
};
