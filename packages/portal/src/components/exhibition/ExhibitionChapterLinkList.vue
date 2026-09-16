<template>
  <LinkList
    :items="linkListItems"
    :title="$t('exhibitions.chapters')"
  />
</template>

<script>
  import { optimisedSrc } from '@/utils/contentful/assets.js';
  import LinkList from '@/components/generic/LinkList';

  export default {
    name: 'ExhibitionChapterLinkList',

    components: {
      LinkList
    },

    props: {
      chapters: {
        type: Array,
        required: true
      },
      credits: {
        type: Boolean,
        default: false
      },
      exhibitionIdentifier: {
        type: String,
        required: true
      }
    },

    computed: {
      chapterLinkListItems() {
        return this.chapters.map((chapter) => ({
          background: this.optimisedBackgroundImageUrl(chapter),
          identifier: chapter.identifier,
          text: chapter.name,
          url: {
            name: 'exhibitions-exhibition-chapter',
            params: {
              exhibition: this.exhibitionIdentifier, chapter: chapter.identifier
            }
          }
        }));
      },
      creditsLinkListItem() {
        if (!this.credits) {
          return null;
        }
        return {
          identifier: 'credits',
          text: this.$t('exhibitions.credits'),
          url: {
            name: 'exhibitions-exhibition-credits',
            params: { exhibition: this.exhibitionIdentifier }
          }
        };
      },
      linkListItems() {
        return this.chapterLinkListItems.concat(this.creditsLinkListItem).filter(Boolean);
      }
    },

    methods: {
      optimisedBackgroundImageUrl(chapter) {
        // FIXME: the height is far too large for the context; reduce it
        return optimisedSrc(
          chapter?.primaryImageOfPage?.image,
          { w: 800, h: 800 }
        ) || chapter?.primaryImageOfPage?.image?.url;
      }
    }
  };
</script>
