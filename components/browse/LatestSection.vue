<template>
  <section class="latest-section row mb-5">
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
          :key="card.fields.identifier"
          :title="card.fields.name"
          :texts="[card.fields.description]"
          :url="cardData(card.fields).cardLink"
          :image-url="cardData(card.fields).imageUrl"
          :image-content-type="cardData(card.fields).imageContentType"
          :image-optimisation-options="{ width: 510 }"
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

  import createClient from '../../plugins/contentful';
  const contentfulClient = createClient();

  export default {
    components: {
      ContentCard
    },

    props: {
      category: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        cards: [],
        total: 0
      };
    },

    computed: {
      contentType() {
        if (this.forExhibitions) {
          return { type: 'exhibitionPage', name: this.$tc('exhibitions.exhibitions', this.total), path: 'exhibitions' };
        } else if (this.forGalleries) {
          return { type: 'imageGallery', name: this.$tc('galleries.galleries', this.total), path: 'galleries' };
        } else if (this.forBlogPosts) {
          return { type: 'blogPosting', name: this.$tc('blog.posts'), path: 'blog' };
        }

        return false;
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
      },

      includeReferenceDepth() {
        return this.forGalleries ? 0 : 1;
      },

      selectFields() {
        return this.forGalleries
          ? 'sys.id,fields.hasPart,fields.identifier,fields.name,fields.description'
          : 'fields.identifier,fields.name,fields.description,fields.primaryImageOfPage';
      }
    },

    async mounted() {
      await contentfulClient.getEntries({
        locale: this.$i18n.isoLocale(),
        'content_type': this.contentType.type,
        order: '-fields.datePublished',
        limit: 4,
        include: this.includeReferenceDepth,
        select: this.selectFields
      })
        .then(async(response) => {
          const cards = response.items;

          if (this.forGalleries) {
            const previewImageIds = cards.map(card => card.fields.hasPart[0].sys.id);
            await contentfulClient.getEntries({
              'sys.id[in]': previewImageIds.join(','),
              include: 0
            })
              .then(async(imageResponse) => {
                for (const card of cards) {
                  card.fields.hasPart = [imageResponse.items.find((imageItem) => {
                    return imageItem.sys.id === card.fields.hasPart[0].sys.id;
                  })];
                }
              });
          }

          this.cards = cards;
          this.total = response.total;
        }).catch(error => {
          throw error;
        });
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
        const image = card.primaryImageOfPage;
        let imageUrl;
        let imageContentType;
        if (image && image.fields && image.fields.image && image.fields.image.fields && image.fields.image.fields.file) {
          imageUrl = image.fields.image.fields.file.url;
          imageContentType = image.fields.image.fields.file.contentType;
        }

        return {
          cardLink: { name, params: { [key]: card.identifier } },
          imageUrl,
          imageContentType
        };
      },
      galleryCardData(card) {
        let imageUrl;

        if (card.hasPart[0].fields.encoding) {
          imageUrl = `${card.hasPart[0].fields.encoding.edmPreview[0]}&size=w200`;
        } else {
          imageUrl = card.hasPart[0].fields.thumbnailUrl;
        }

        return {
          cardLink: { name: 'galleries-all', params: { pathMatch: card.identifier } },
          imageUrl
        };
      }
    }
  };

</script>

<style lang="scss" scoped>

@import "./assets/scss/variables.scss";

.latest-section {
  h2 {
    color: $mediumgrey;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
    text-align: left;
  }
}
</style>
