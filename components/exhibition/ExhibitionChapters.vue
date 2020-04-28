<template>
  <section>
    <b-card-group
      :class="`card-deck-search card-deck-4-cols`"
      deck
      data-qa="exhibition chapters"
    >
      <ContentCard
        v-for="chapter in chaptersAndCredits"
        :key="chapter.fields.identifier"
        :title="chapter.fields.name"
        :url="chapterUrl(chapter)"
        :image-url="chapterImageUrl(chapter)"
        :image-content-type="chapterImageContentType(chapter)"
        :image-optimisation-options="{ width: 510 }"
        :texts="[chapterText(chapter)]"
        :data-qa="`exhibitions ${chapter.fields.identifier} card`"
        variant="mini"
      />
    </b-card-group>
  </section>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  export default {
    components: {
      ContentCard
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
          fields: {
            name: this.$t('exhibitions.credits'),
            identifier: 'credits'
          }
        };
      }
    },
    methods: {
      chapterUrl(chapter) {
        return chapter.fields.identifier === 'credits' ? {
          name: 'exhibitions-exhibition-credits',
          params: { exhibition: this.exhibitionIdentifier }
        } : {
          name: 'exhibitions-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: chapter.fields.identifier
          }
        };
      },
      chapterText(chapter) {
        return chapter.fields.identifier === this.currentChapter ? this.$t('exhibitions.currentChapter') : '';
      },
      chapterImageUrl(chapter) {
        if (!chapter.fields.primaryImageOfPage) return;
        if (!chapter.fields.primaryImageOfPage.fields.image) return;
        if (!chapter.fields.primaryImageOfPage.fields.image.fields.file) return;
        return chapter.fields.primaryImageOfPage.fields.image.fields.file.url;
      },
      chapterImageContentType(chapter) {
        if (!chapter.fields.primaryImageOfPage) return;
        if (!chapter.fields.primaryImageOfPage.fields.image) return;
        if (!chapter.fields.primaryImageOfPage.fields.image.fields.file) return;
        return chapter.fields.primaryImageOfPage.fields.image.fields.file.contentType;
      }
    }
  };
</script>
