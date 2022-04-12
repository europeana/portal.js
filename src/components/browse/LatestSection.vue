<template>
  <section
    class="latest-section row mb-5"
  >
    <div class="col-12">
      <h2>
        {{ contentType.name }}
      </h2>
      <b-card-group
        class="card-deck-4-cols"
        deck
        :data-qa="`latest ${contentType.name}`"
      >
        <ContentCard
          v-for="card in cards"
          :key="card.identifier"
          :title="card.name"
          :texts="[card.description]"
          :url="cardData(card).cardLink"
          :image-url="cardData(card).imageUrl"
          :image-content-type="cardData(card).imageContentType"
          :image-optimisation-options="{ width: 510 }"
          :image-alt="cardData(card).description"
        />
      </b-card-group>
      <b-button
        v-if="total > 4"
        variant="light"
        :to="localePath({ name: contentType.path })"
      >
        {{ showMoreLink }}
      </b-button>
    </div>
  </section>
</template>

<script>
  import ContentCard from '../../components/generic/ContentCard';

  export default {
    components: {
      ContentCard
    },

    props: {
      category: {
        type: String,
        required: true
      },

      cards: {
        type: Array,
        default: () => []
      },

      total: {
        type: Number,
        default: 0
      }
    },

    computed: {
      contentType() {
        let contentType = {};

        if (this.forExhibitions) {
          contentType = { type: 'exhibitionPage', name: this.$tc('exhibitions.exhibitions', this.total), path: 'exhibitions' };
        } else if (this.forGalleries) {
          contentType = { type: 'imageGallery', name: this.$tc('galleries.galleries', this.total), path: 'galleries' };
        } else if (this.forBlogPosts) {
          contentType = { type: 'blogPosting', name: this.$tc('blog.posts', this.total), path: 'blog' };
        }

        return contentType;
      },

      forGalleries() {
        return this.category === 'Galleries';
      },

      forExhibitions() {
        return this.category === 'Exhibitions';
      },

      forBlogPosts() {
        return this.category === 'Blog posts';
      },

      showMoreLink() {
        return `${this.$tc('showMore')} ${this.contentType.name.toLowerCase()} (${this.total})`;
      }
    },

    methods: {
      cardData(card) {
        if (this.forExhibitions) {
          return this.defaultCardData(card, 'exhibitions-exhibition');
        } else if (this.forGalleries) {
          return this.galleryCardData(card);
        } else if (this.forBlogPosts) {
          return  this.defaultCardData(card, 'blog-all');
        }

        return null;
      },
      defaultCardData(card, name) {
        const key = name === 'exhibitions-exhibition' ? 'exhibition' : 'pathMatch';

        return {
          cardLink: { name, params: { [key]: card.identifier } },
          description: card.description ? card.description : '',
          imageUrl: card.primaryImageOfPage?.image?.url,
          imageContentType: card.primaryImageOfPage?.image?.contentType
        };
      },
      galleryCardData(card) {
        return {
          cardLink: { name: 'galleries-all', params: { pathMatch: card.identifier } },
          imageUrl: this.$apis.thumbnail.edmPreview(
            (card.hasPartCollection.items[0].encoding || card.hasPartCollection.items[0].thumbnailUrl), 400
          )
        };
      }
    }
  };

</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.latest-section {
  h2 {
    color: $mediumgrey;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.1212rem;
    text-align: left;
  }
}
</style>
