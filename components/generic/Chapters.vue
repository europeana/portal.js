<template>
  <section>
    <h2
      v-if="title"
      class="is-size-3 text-uppercase"
    >
      {{ title }}
    </h2>
    <b-list-group
      deck
      data-qa="generic chapters"
    >
      <SmartLink
        v-for="chapter in chapters"
        :key="chapter.identifier"
        :style="`background-image: url(${optimisedBackgroundImageUrl(chapter)})`"
        class="chapter w-100 text-left d-flex justify-content-start align-items-start"
        :destination="chapter.url"
      >
        <span class="number" />
        <span>{{ chapter.text }}</span>
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
      title: {
        type: String,
        default: null
      },
      chapters: {
        type: Array,
        required: true
      }
    },
    methods: {
      chapterImage(chapter) {
        if (!chapter) return;
        if (!chapter.primaryImageOfPage) return;
        if (!chapter.primaryImageOfPage.image) return;
        return chapter.primaryImageOfPage.image.url;
      },
      chapterImageContentType(chapter) {
        if (!chapter) return;
        if (!chapter.primaryImageOfPage) return;
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

  section {
    counter-reset: chapters;
  }

  h2 {
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .chapter {
    border: 0;
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding: 1rem 2rem;
    position: relative;
    text-transform: none;
    background-size: cover;
    border-radius: $border-radius;
    text-decoration: none;
    background-color: $offwhite;
    color: $black;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
      color: $white;
    }

    span {
      position: relative;
      z-index: 2;
    }
    .number {
      margin-right: 1.5rem;
      &:before {
        counter-increment: chapters;
        content: counter(chapters, decimal-leading-zero);
        display: inline-block;
      }
    }

    &:last-of-type {
      margin-bottom: 0;

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
