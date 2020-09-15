<template>
  <section>
    <h2 class="is-size-3 text-uppercase">
      {{ $t('exhibitions.chapters') }}
    </h2>
    <b-list-group
      deck
      data-qa="exhibition chapters"
    >
      <SmartLink
        v-for="(chapter, index) in chaptersAndCredits"
        :key="chapter.identifier"
        :style="`background-image: url(${optimisedBackgroundImageUrl(chapter)})`"
        class="chapter w-100 text-left d-flex justify-content-start align-items-center"
        :destination="chapterUrl(chapter)"
        :data-qa="`exhibitions ${chapter.identifier} card`"
      >
        <span class="pl-3 pr-4">{{ index + 1 }}</span>
        <span>{{ chapter.name }}</span>
      </SmartLink>
    </b-list-group>
  </section>
</template>

<script>
  import SmartLink from '../../components/generic/SmartLink';
  export default {
    components: {
      SmartLink
    },
    props: {
      exhibitionIdentifier: {
        type: String,
        required: true
      },
      chapters: {
        type: Array,
        required: true
      },
      credits: {
        type: String,
        default: null
      }
    },
    computed: {
      currentChapter() {
        return this.$route.name.startsWith('exhibitions-exhibition-credits') ? 'credits' : this.$route.params.chapter;
      },
      chaptersAndCredits() {
        return this.chapters.concat(this.creditsChapter || []);
      },
      creditsChapter() {
        if (!this.credits) return null;
        return {
          name: this.$t('exhibitions.credits'),
          identifier: 'credits'
        };
      }
    },
    methods: {
      chapterUrl(chapter) {
        return chapter.identifier === 'credits' ? {
          name: 'exhibitions-exhibition-credits',
          params: { exhibition: this.exhibitionIdentifier }
        } : {
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: chapter.identifier
          }
        };
      },
      chapterText(chapter) {
        return chapter.identifier === this.currentChapter ? this.$t('exhibitions.currentChapter') : '';
      },
      chapterImage(chapter) {
        if (!chapter.primaryImageOfPage) return;
        if (!chapter.primaryImageOfPage.image) return;
        if (!chapter.primaryImageOfPage.image) return;
        return chapter.primaryImageOfPage.image.url;
      },
      chapterImageContentType(chapter) {
        if (!chapter.primaryImageOfPage) return;
        if (!chapter.primaryImageOfPage.image) return;
        if (!chapter.primaryImageOfPage.image) return;
        return chapter.primaryImageOfPage.image.contentType;
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
</script>

<style lang="scss" scoped>
  @import './assets/scss/variables.scss';

  h2 {
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .chapter {
    border: 0;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding: 1rem;
    position: relative;
    text-transform: none;
    background-color: rgba(0, 0, 0, 0.7);
    background-size: cover;
    border-radius: $border-radius;
    color: $white;
    text-decoration: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
      color: $white;
    }

    span {
      position: relative;
      z-index: 2;
    }

    &:after {
      content: '';
      background: rgba(0, 0, 0, 0.7);
      border-radius: $border-radius;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    &:last-of-type {
      background-color: $offwhite;
      color: $black;
      &:after {
        display: none;
      }
      &:hover {
        box-shadow: none;
      }
    }
    &.nuxt-link-active {
      background-color: $blue;
      background-image: none !important;
      color: $white;
      &:after {
        display: none;
      }
    }
  }
</style>
