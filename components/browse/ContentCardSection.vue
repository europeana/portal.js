<template>
  <section
    v-if="section && section.fields"
    class="browse-section row mb-5"
    data-qa="browse section"
  >
    <div class="col-12 col-lg-9">
      <h2
        data-qa="section headline"
      >
        {{ section.fields.headline }}
      </h2>
      <p>
        {{ section.fields.text }}
      </p>
    </div>
    <div class="col-12">
      <b-card-group
        class="card-deck-4-cols"
        deck
        data-qa="section group"
      >
        <BrowseContentCard
          v-for="card in cards"
          :key="card.sys.id"
          :fields="card.fields"
          :card-type="cardType(card)"
        />
      </b-card-group>
      <SmartLink
        v-if="section.fields.moreButton"
        :destination="section.fields.moreButton.fields.url"
        class="btn btn-light"
        data-qa="section more button"
      >
        {{ section.fields.moreButton.fields.text }}
      </SmartLink>
    </div>
  </section>
</template>

<script>
  import BrowseContentCard from './BrowseContentCard';
  import SmartLink from '../generic/SmartLink';

  export default {
    components: {
      BrowseContentCard,
      SmartLink
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      cards() {
        const cards = this.section.fields.hasPart.filter(card => card.fields);
        return cards.map(card => {
          const identifier = card.fields.identifier;
          const id = card.sys.contentType.sys.id;
          if (id === 'automatedEntityCard' && identifier.match(/base/) && cards.length === 4) {
            return { ...card, mini: true };
          }
          return { ...card };
        });
      }
    },

    methods: {
      cardType(card) {
        if (card.mini) {
          return 'mini';
        } else if (card.sys.contentType) {
          return card.sys.contentType.sys.id;
        } else {
          return '';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

@import "./assets/scss/variables.scss";

.browse-section {
  h2,
  p {
    color: $mediumgrey;
    text-align: left;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
  }

  p {
    letter-spacing: 0.0975rem;
    line-height: 1.5;
  }
}

</style>
