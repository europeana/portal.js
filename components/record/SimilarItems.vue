<template>
  <div
    class="p-3 pb-5 card"
    data-qa="similar items"
  >
    <b-card-group
      class="card-deck-4-cols similar-items"
      deck
    >
      <ContentCard
        v-for="(item, index) in items"
        :key="index"
        :title="item.fields.dcTitle[0]"
        :image-url="item.edmPreview"
        :url="{ name: 'record-all', params: { pathMatch: item.europeanaId.slice(1) } }"
      />
    </b-card-group>
  </div>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

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

      &:hover, &:focus {
        color: $blue;
      }
    }

    .card-img {
      border-radius: 0;
      margin-bottom: 1rem;

      &:after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }
    }

    .card-body {
      min-height: auto;
      padding: 0;
    }
  }
</style>
