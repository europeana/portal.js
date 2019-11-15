<template>
  <section class="row py-4 px-2 bg-white">
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
