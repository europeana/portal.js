<template>
  <section>
    <b-card-group
      :class="`card-deck-search card-deck-4-cols`"
      deck
      data-qa="exhibition chapters"
    >
      <ContentCard
        v-for="chapter in chapters"
        :key="chapter.sys.id"
        :title="chapter.fields.name"
        :url="chapterUrl(chapter)"
        :image-url="chapterImageUrl(chapter)"
        :image-content-type="chapterImageContentType(chapter)"
        :texts="[chapter.fields.description]"
      />
      <ContentCard
        v-if="credits"
        :title="$t('exhibitions.credits')"
        :url="{ name: 'exhibition-exhibition-credits', params: { exhibition: exhibitionIdentifier } }"
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
    methods: {
      chapterUrl(chapter) {
        return {
          name: 'exhibition-exhibition-chapter',
          params: {
            exhibition: this.exhibitionIdentifier, chapter: chapter.fields.identifier
          }
        };
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
