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
      chapterNavigation: {
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
      currentChapterIndex() {
        if (this.chapterNavigation.length <= 1) return false;
        return this.chapterNavigation.findIndex(chapter => chapter.identifier === this.currentChapter);
      },
      nextChapter() {
        const nextIndex = this.currentChapterIndex + 1;
        return this.getChapter(nextIndex);
      },
      previousChapter() {
        const prevIndex = this.currentChapterIndex - 1;
        return this.getChapter(prevIndex);
      }
    },
    methods: {
      getChapter(index) {
        return this.chapterNavigation[index] ? this.chapterNavigation[index] : null;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/icons.scss';

  .chapter-nav {
    align-items: center;
    display: flex;
    text-align: right;
    text-decoration: none;

    &.next:after {
      @extend .icon-font;
      content: '\e91c';
      padding-left: 0.5rem;
    }

    &.prev {
      margin-right: auto;
      text-align: left;

      &:before {
        @extend .icon-font;
        content: '\e91b';
        padding-right: 0.5rem;
      }
    }
  }
</style>
