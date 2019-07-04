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
          if (card.fields.thumbnailUrl) {
            card.fields.imageUrl = card.fields.thumbnailUrl;
          } else {
            card.fields.imageUrl = (card.fields.image && card.fields.image.fields) ? card.fields.image.fields.file.url : '';
          }
          return card;
        });
      }
    },
    methods: {
      moreLabelKey: function (card) {
        // TODO: Allow arbitrary value overwrites per card via the CMS.
        return card.fields.identifier ? 'goToRecord' : 'readMore';
      },
      cardDestination: function (card) {
        // TODO: Refactor content model to set this directly, so this method can be skipped.
        if (card.fields.url) {
          return card.fields.url;
        } else if (card.fields.identifier) {
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
