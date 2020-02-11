<template>
  <div class="mt-3 mb-5 d-flex justify-content-end">
    <b-button
      v-if="previousChapter"
      :to="previousChapter.url"
      class="chapter-nav prev"
      data-qa="previous chapter button"
      variant="outline-primary text-decoration-none"
    >
      {{ previousChapter.name }}
    </b-button>
    <b-button
      v-if="nextChapter"
      :to="nextChapter.url"
      class="chapter-nav next"
      data-qa="next chapter button"
      variant="outline-primary text-decoration-none"
    >
      {{ nextChapter.name }}
    </b-button>
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
        return this.chapterNavigation.findIndex(chapter => chapter.identifier === this.currentChapter);
      },
      nextChapter() {
        const nextIndex = this.currentChapterIndex + 1;
        return this.chapterNavigation[nextIndex];
      },
      previousChapter() {
        const prevIndex = this.currentChapterIndex - 1;
        return this.chapterNavigation[prevIndex];
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .chapter-nav {
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    text-align: right;
    text-decoration: none;

    &:hover {
      background-color: $blue;
    }

    &.next:after {
      @extend .icon-font;
      content: '\e91c';
      padding-left: 0.5rem;
      padding-top: 0.1rem;
    }

    &.prev {
      margin-right: auto;
      text-align: left;

      &:before {
        @extend .icon-font;
        content: '\e91b';
        padding-right: 0.5rem;
        padding-top: 0.1rem;
      }
    }
  }
</style>
