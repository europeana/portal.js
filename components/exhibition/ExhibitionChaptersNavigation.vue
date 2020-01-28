<template>
  <div class="my-3 d-flex justify-content-end">
    <b-link
      v-if="previousChapter"
      :to="previousChapter.url"
      class="chapter-nav prev"
      data-qa="previous chapter button"
    >
      {{ previousChapter.name }}
    </b-link>
    <b-link
      v-if="nextChapter"
      :to="nextChapter.url"
      class="chapter-nav next"
      data-qa="next chapter button"
    >
      {{ nextChapter.name }}
    </b-link>
  </div>
</template>

<script>
  export default {
    props: {
      exhibitionIdentifier: {
        type: String,
        required: true
      },
      chapters: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        currentChapter: this.$route.params.chapter
      };
    },
    computed: {
      nextChapter() {
        const nextIndex = this.currentChapterIndex() + 1;
        return this.getChapter(nextIndex);
      },
      previousChapter() {
        const prevIndex = this.currentChapterIndex() - 1;
        return this.getChapter(prevIndex);
      }
    },
    methods: {
      currentChapterIndex() {
        if (this.chapters.length <= 1) return false;
        return this.chapters.findIndex(chapter => chapter.fields.identifier === this.currentChapter);
      },
      getChapter(index) {
        return this.chapters[index] ?
          { 'name': this.chapters[index].fields.name, 'url': this.chapterUrl(this.chapters[index]) } : null;
      },
      chapterUrl(chapter) {
        return this.localePath({
          name: 'exhibition-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: chapter.fields.identifier
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/icons.scss';

  .chapter-nav {
    text-decoration: none;

    &.next:after {
      @extend .icon-font;
      content: '\e91c';
    }

    &.prev {
      margin-right: auto;

      &:before {
        @extend .icon-font;
        content: '\e91b';
      }
    }
  }
</style>
