<template>
  <section
    v-if="section"
    class="info-card-section row mb-3"
  >
    <div class="col-12">
      <b-card-group
        :class="cardGroupClass"
        deck
        align="center"
        data-qa="section group"
      >
        <InfoCard
          v-for="(card, index) in cards"
          :key="index"
          :url="card.url"
          :info="card.info"
          :label="card.label"
          :image="card.image"
          :variant="cardVariant"
        />
      </b-card-group>
      <SmartLink
        v-if="section.moreButton"
        :destination="section.moreButton.url"
        class="btn btn-light"
        data-qa="section more button"
      >
        {{ section.moreButton.text }}
      </SmartLink>
    </div>
  </section>
</template>

<script>
  import InfoCard from '../generic/InfoCard';

  export default {
    components: {
      InfoCard
    },
    props: {
      section: {
        type: Object,
        default: () => (null)
      }
    },
    computed: {
      cards() {
        return this.section.hasPartCollection.items.filter(card => card !== null);
      },
      cardGroupClass() {
        if (this.section.type === 'itemCountsMediaType') {
          return 'card-deck-3-cols';
        } else {
          return 'card-deck-4-cols';
        }
      },
      cardVariant() {
        if (this.section.type === 'itemCountsMediaType') {
          return 'default';
        } else {
          return 'dark';
        }
      }
    }
  };
</script>
