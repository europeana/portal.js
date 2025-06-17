<template>
  <section
    v-if="cards.length > 0"
    data-qa="latest editorial"
  >
    <h2 class="card-group-title">
      {{ $t('homePage.discoverEditorial') }}
    </h2>
    <b-card-group
      class="card-deck-4-cols"
      deck
    >
      <!-- TODO: use/add image alt description -->
      <ContentCard
        v-for="card in cards"
        :key="card.identifier"
        :title="card.name"
        :image-url="cardImage(card)"
        :url="contentfulEntryUrl(card)"
      />
    </b-card-group>
    <b-button
      variant="outline-secondary"
      :to="'/stories'"
    >
      {{ $t('homePage.storiesCTA') }}
    </b-button>
  </section>
</template>

<script>
  import ContentCard from '../content/ContentCard';
  import latestEditorialContentGraphql from '@/graphql/queries/latestEditorialContent.graphql';
  import { contentfulEntryUrl } from '@/utils/contentful/entry-url.js';

  export default {
    name: 'HomeLatestStories',

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
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview',
        limit: 3
      };

      const response = await this.$contentful.query(latestEditorialContentGraphql, variables);
      const entries = response.data;

      // Select four stories: at least one of each type, max two of each type;
      // sorted by date published, most recent first
      this.cards = entries.storyCollection.items
        .concat(entries.exhibitionPageCollection.items)
        .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
        .slice(0, 4);
    },

    methods: {
      contentfulEntryUrl,

      cardImage(card) {
        return card.primaryImageOfPage?.image?.url;
      }
    }
  };
</script>
