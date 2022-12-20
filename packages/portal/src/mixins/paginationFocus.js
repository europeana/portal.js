export default {
  data() {
    return {
      paginationChanged: false
    };
  },

  watch: {
    page: 'startHandlePaginationChange'
  },

  methods: {
    startHandlePaginationChange() {
      console.log('startHandlePaginationChange')
      this.paginationChanged = true;
    },

    finishHandlePaginationChange(refs) {
      if (this.paginationChanged) {
        console.log('finishHandlePaginationChange')
        // Move the focus to the first available link, if any
        const link = refs?.[0]?.$el?.getElementsByTagName('a')?.[0];
        link?.focus();
        this.paginationChanged = false;
      }
    }
  }
};
