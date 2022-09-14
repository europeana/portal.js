export default {
  methods: {
    chapterPagesToLinkListItems(chapters, identifier) {
      chapters = chapters.concat(this.creditsChapter() || []);
      chapters = chapters.filter(listItem => listItem !== null);
      chapters.map(chapter => {
        chapter.url = chapter.identifier === 'credits' ?
          {
            name: 'exhibitions-exhibition-credits',
            params: { exhibition: identifier }
          } :
          {
            name: 'exhibitions-exhibition-chapter',
            params: {
              exhibition: identifier, chapter: chapter.identifier
            }
          };
        chapter.background = this.optimisedBackgroundImageUrl(chapter);
        chapter.text = chapter.name;
      }
      );

      return chapters;
    },
    creditsChapter() {
      if (!this.credits) {
        return null;
      }
      return {
        name: this.$t('exhibitions.credits'),
        identifier: 'credits'
      };
    },
    chapterImage(chapter) {
      return chapter?.primaryImageOfPage?.image?.url;
    },
    chapterImageContentType(chapter) {
      return chapter?.primaryImageOfPage?.image?.contentType;
    },
    optimisedBackgroundImageUrl(chapter) {
      return this.$options.filters.optimisedImageUrl(
        this.chapterImage(chapter),
        this.chapterImageContentType(chapter),
        { width: 800, height: 800 }
      );
    }
  }
};
