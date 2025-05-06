import { optimisedContentfulImageUrl } from '@/utils/contentful/assets.js';

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

    optimisedBackgroundImageUrl(chapter) {
      // FIXME: the height is far too large for the context; reduce it
      return optimisedContentfulImageUrl(
        chapter?.primaryImageOfPage?.image,
        { w: 800, h: 800 }
      ) || chapter?.primaryImageOfPage?.image?.url;
    }
  }
};
