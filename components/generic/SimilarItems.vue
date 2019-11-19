<template>
  <section class="row py-4 px-2 card">
    <b-col>
      <b-card-group
        class="card-deck-4-cols similar-items"
        deck
      >
        <ContentCard
          v-for="(item, index) in items"
          :key="index"
          :title="item.title"
          :image-url="item.thumbnail"
          :url="{ name: 'record-all', params: { pathMatch: item.identifier.slice(1) } }"
          is-square
        />
      </b-card-group>
    </b-col>
  </section>
</template>

<script>
  import ContentCard from './ContentCard';

  export default {
    name: 'SimilarItems',

    components: {
      ContentCard
    },

    props: {
      items: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss">
  @import "./assets/scss/variables.scss";

  .similar-items {
    .content-card {
      background: transparent;
      border: 0;
      box-shadow: none;
      min-height: auto;
      margin-bottom: 0;

      @media (max-width: $bp-medium) {
        flex: 100%;
        margin-bottom: 1rem;
      }
    }

    .card-link {
      display: initial;
    }

    .card-img {
      border: 0;
      padding: 0;
      border-radius: 0;
      width: 100%;
    }

    .is-square {
      &:after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }
    }

    .card-body {
      min-height: auto;
      padding-bottom: 0;
    }
  }
</style>
