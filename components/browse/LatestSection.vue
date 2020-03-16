<template>
  <section class="row mb-5">
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
        :to="localePath({ name: category.toLowerCase() })"
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
        if (this.category === 'Exhibitions') {
          return { type: 'exhibitionPage', name: this.$t('exhibitions.exhibitions') };
        } else if (this.category === 'Galleries') {
          return { type: 'imageGallery', name: this.$t('galleries.galleries') };
        } else {
          return false;
        }
      },
      showMoreLink() {
        return `${this.$t('showMore')} ${this.contentType.name.toLowerCase()} (${this.total})`;
      }
    },

    async mounted() {
      await contentfulClient.getEntries({
        locale: this.$i18n.isoLocale(),
        'content_type': this.contentType.type,
        order: '-fields.datePublished',
        limit: 4
      })
        .then((response) => {
          this.cards = response.items;
          this.total = response.total;
        }).catch(error => {
          throw error;
        });
    },

    methods: {
      cardData(card) {
        const identifier = card.identifier;
        let cardLink;
        let imageUrl;
        let imageContentType;

        if (this.category === 'Exhibitions') {
          const image = card.primaryImageOfPage;

          if (image && image.fields && image.fields.image && image.fields.image.fields && image.fields.image.fields.file) {
            imageUrl = image.fields.image.fields.file.url;
            imageContentType = image.fields.image.fields.file.contentType;
          }

          cardLink = { name: 'exhibitions-exhibition', params: { exhibition: identifier } };

        } else if (this.category === 'Galleries') {
          imageUrl = card.hasPart[0].fields.thumbnailUrl;
          cardLink = { name: 'galleries-all', params: { pathMatch: identifier } };
        }

        return {
          cardLink,
          imageUrl,
          imageContentType
        };
      }
    }
  };

</script>
