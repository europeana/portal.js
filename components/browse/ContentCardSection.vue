<template>
  <div
    v-if="section && section.fields"
    class="browse-section mb-3"
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
      <BrowseContentCard
        v-for="card in cards"
        :key="card.sys.id"
        :fields="card.fields"
      />
    </b-card-group>
  </div>
</template>

<script>
  import BrowseContentCard from './BrowseContentCard';

  export default {
    components: {
      BrowseContentCard
    },
    props: {
      section: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      cards() {
        return this.section.fields.hasPart.filter(card => card.fields);
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
