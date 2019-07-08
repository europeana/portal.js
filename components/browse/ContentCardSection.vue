<template>
  <div
    v-if="section && section.fields"
    class="browse-section mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-6 p-0">
      <h2
        data-qa="section headline"
      >
        {{ section.fields.headline }}
      </h2>
      <p>
        {{ section.fields.text }}
      </p>
    </div>
    <b-card-group
      deck
      data-qa="section group"
    >
      <ContentCard
        v-for="card in cards"
        :key="card.sys.id"
        :title="card.fields.name"
        :texts="cardTexts(card)"
        :url="cardDestination(card)"
        :image-url="card.fields.imageUrl"
        :view-more-label-key="moreLabelKey(card)"
      />
    </b-card-group>
  </div>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
  import { getWikimediaThumbnailUrl, getEntityRouterLink } from '../../plugins/europeana/entity';

  export default {
    components: {
      ContentCard
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      cards: function() {
        return this.section.fields.hasPart.filter(card => card.fields).map(card => {
          card.fields.imageUrl = this.cardImageUrl(card);
          return card;
        });
      }
    },
    methods: {
      cardImageUrl: function (card) {
        if (card.fields.thumbnailUrl) {
          return card.fields.thumbnailUrl;
        } else if (typeof card.fields.image === 'string') {
          if (card.fields.image.startsWith('http://commons.wikimedia.org/wiki/Special:FilePath/')) {
            return getWikimediaThumbnailUrl(card.fields.image);
          } else {
            return card.fields.image;
          }
        } else if (card.fields.image && card.fields.image.fields) {
          return card.fields.image.fields.file.url;
        } else {
          return '';
        }
      },
      moreLabelKey: function (card) {
        // TODO: Allow arbitrary value overwrites per card via the CMS.
        return card.fields.identifier ? 'goToRecord' : 'readMore';
      },
      cardDestination: function (card) {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        if (card.fields.url) {
          return card.fields.url;
        } else if (typeof card.fields.identifier === 'string') {
          if (/^https?:\/\//.test(card.fields.identifier)) {
            if (card.fields.identifier.includes('://data.europeana.eu/')) {
              return this.localePath(getEntityRouterLink(card.fields.identifier));
            } else {
              return card.fields.identifier;
            }
          }
          return this.localePath({ name: 'record-all', params: { pathMatch: card.fields.identifier.slice(1) } });
        }
      },
      cardTexts: function (card) {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        let texts = [];
        for (const field of ['description', 'creator', 'provider']) {
          if (card.fields[field]) {
            texts.push(card.fields[field]);
          }
        }
        return texts;
      }
    }
  };
</script>

<style lang="scss" scoped>

@import "./assets/scss/variables.scss";

.browse-section {
  h2,
  p {
    color: $darkgrey;
    text-align: left;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
  }

  p {
    letter-spacing: 0.0975rem;
    line-height: 1.5;
  }
}

</style>
