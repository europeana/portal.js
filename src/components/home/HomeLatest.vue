<template>
  <section
    v-if="cards.length > 0"
    class="container-fluid"
    data-qa="latest editorial"
  >
    <h2 class="text-center">
      {{ $t('homePage.discoverEditorial') }}
    </h2>
    <b-card-group
      class="card-deck-3-cols justify-content-center"
      deck
    >
      <!-- TODO: use/add image alt description -->
      <ContentCard
        v-for="card in cards"
        :key="card.identifier"
        :title="card.name"
        :image-url="cardImage(card)"
        :image-optimisation-options="{ width: 510 }"
        :url="cardLink(card)"
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

    data() {
      return {
        cards: []
      };
    },

    async fetch() {
      const variables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview',
        limit: 1
      };

      const response = await this.$contentful.query('latestEditorialContent', variables);
      const entries = response.data.data;

      this.cards = entries.blogPostingCollection.items
        .concat(entries.exhibitionPageCollection.items)
        .concat(entries.imageGalleryCollection.items);
    },

    methods: {
      cardLink(card) {
        let link;
        if (card['__typename'] === 'ImageGallery') {
          link = { name: 'galleries-all', params: { pathMatch: card.identifier } };
        } else if (card['__typename'] === 'ExhibitionPage') {
          link = { name: 'exhibitions-exhibition', params: { exhibition: card.identifier } };
        } else if (card['__typename'] === 'BlogPosting') {
          link = { name: 'blog-all', params: { pathMatch: card.identifier } };
        }
        return link;
      },

      cardImage(card) {
        if (card['__typename'] === 'ImageGallery') {
          const edmPreview = card.hasPartCollection.items[0].encoding?.edmPreview?.[0] || card.hasPartCollection.items[0].thumbnailUrl;
          return this.$apis.thumbnail.edmPreview(edmPreview, { size: 400 });
        }
        return card.primaryImageOfPage?.image?.url;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  h2 {
    color: $mediumgrey;
    font-size: 2rem;
  }

  .card-deck {
    flex-flow: row wrap;
  }

  ::v-deep .content-card {
    min-height: 0;

    .card-title {
      display: block;
      -webkit-line-clamp: none;
    }

    @media (min-width: $bp-small) {
      max-width: 400px; /* gallery thumbnails are 400px wide */
    }

    @media (min-width: $bp-extraextralarge) {
      .card-subtitle {
        font-size: 0.75vw;
      }

      .card-body {
        padding: 2rem;
      }

      .card-title {
        font-size: 1vw;
        line-height: 1.1875vw;
        max-height: none;
        overflow: none;
      }

      .card-img {
        min-height: 25rem;
        max-height: 25rem;
      }
    }
  }
</style>
