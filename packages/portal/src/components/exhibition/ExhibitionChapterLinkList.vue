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
        type: String,
        default: null
      },
      exhibitionIdentifier: {
        type: String,
        required: true
      }
    },

    computed: {
      creditsChapter() {
        if (!this.credits) {
          return null;
        }
        return {
          name: this.$t('exhibitions.credits'),
          identifier: 'credits'
        };
      },
      linkListItems() {
        return this.chapters
          .concat(this.creditsChapter || [])
          .filter(Boolean)
          .map((chapter) => {
            chapter.url = chapter.identifier === 'credits' ?
              {
                name: 'exhibitions-exhibition-credits',
                params: { exhibition: this.exhibitionIdentifier }
              } :
              {
                name: 'exhibitions-exhibition-chapter',
                params: {
                  exhibition: this.exhibitionIdentifier, chapter: chapter.identifier
                }
              };
            chapter.background = this.optimisedBackgroundImageUrl(chapter);
            chapter.text = chapter.name;
            return chapter;
          });
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
