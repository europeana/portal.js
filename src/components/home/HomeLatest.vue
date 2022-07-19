<template>
  <section
    v-if="cards.length > 0"
    class="text-center"
    data-qa="latest editorial"
  >
    <h2>
      {{ $t('homePage.discoverEditorial') }}
    </h2>
    <b-button
      variant="outline-secondary"
      class="cta"
      :to="'/stories'"
    >
      {{ $t('homePage.storiesCTA') }}
    </b-button>
    <b-card-group
      class="mt-3 card-deck-3-cols justify-content-center gridless-browse-cards"
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

    @media (min-width: $bp-extralarge) {
      font-size: 2.375rem;
    }

    @media (min-width: $bp-xxxl) {
      font-size: 2vw;
    }
  }

  .cta {
    margin: 1.5em auto;

    @media (min-width: $bp-xxxl) {
      font-size: 1vw;
    }
  }

  .card-deck {
    flex-flow: row wrap;
  }
</style>
