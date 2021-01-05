<template>
  <section>
    <h2
      v-if="title || exhibition"
      class="is-size-3 text-uppercase"
    >
      {{ exhibition ? $t('exhibitions.chapters') : title }}
    </h2>
    <b-list-group
      v-if="exhibition"
      deck
      data-qa="exhibition chapters"
    >
      <SmartLink
        v-for="chapter in chaptersAndCredits"
        :key="chapter.identifier"
        :style="`background-image: url(${optimisedBackgroundImageUrl(chapter)})`"
        class="item exhibition-chapter w-100 text-left d-flex justify-content-start align-items-start"
        :destination="chapterUrl(chapter)"
        :data-qa="`exhibitions ${chapter.identifier} card`"
      >
        <span class="number" />
        <span>{{ chapter.name }}</span>
      </SmartLink>
    </b-list-group>

    <b-list-group
      v-else
      deck
      data-qa="generic link list"
    >
      <SmartLink
        v-for="item in items"
        :key="item.identifier"
        class="item w-100 text-left d-flex justify-content-start align-items-start"
        :destination="item.url"
      >
        <span class="number" />
        <span>{{ item.text }}</span>
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
      exhibition: {
        type: Boolean,
        default: false
      },
      exhibitionIdentifier: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      items: {
        type: Array,
        required: true
      },
      credits: {
        type: String,
        default: null
      }
    },
    computed: {
      chaptersAndCredits() {
        return this.items.concat(this.creditsChapter || []);
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
    counter-reset: items;
  }

  h2 {
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .item {
    border: 0;
    font-size: 1.125rem;
    font-weight: normal;
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
    &.exhibition-chapter {
      background-color: rgba(0, 0, 0, 0.7);
      color: $white;
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
        margin-bottom: 0;
        &:after {
          display: none;
        }
        &:hover {
          box-shadow: none;
        }
      }
    }

    span {
      position: relative;
      z-index: 2;
    }
    .number {
      margin-right: 1.5rem;
      &:before {
        counter-increment: items;
        content: counter(items, decimal-leading-zero);
        display: inline-block;
      }
    }

    &.nuxt-link-active {
      &, &:last-of-type {
        background-color: $blue;
        background-image: none !important;
        color: $white;
        &:after {
          display: none;
        }
      }
    }
  }
</style>
