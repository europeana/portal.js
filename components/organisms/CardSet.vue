<template>
  <div class="card-set">
    <Card
      v-for="card in cardData"
      :key="card.id"
      :thumbnail="card.thumbnail"
      :link-text="card.linkText"
      :texts="card.texts"
      :id="card.id"
      :url="card.url"
    />
  </div>
</template>

<script>
import Card from '../molecules/Card';

export default{
  components: { Card },
  props: {
    cardData: {
      type: Array,
      default() {}
    }
  }
};

</script>

<style lang="scss" scoped>

  .card-set{
    display:   flex;
    flex-flow: row wrap;

    &.grid{
      display: grid;
      grid-column: main;
      grid-column-gap: 1.75rem;
      grid-row-gap: 4rem;
      grid-template-rows: auto;

      &.width-fluid {
        grid-template-columns: repeat(auto-fill, minmax(16.875rem, 1fr));
        width: 100%;
      }

      &.single-row {
        grid-template-columns: repeat(16, 1fr);
        width: 400%;
      }
    }

    .card{
      background-color: #f9f7f7;
      border-radius:    4px;
      box-shadow:       0 1px 3px 0 rgba(0, 0, 0, 0.25);
      min-height:      20em;

      .card-img{
        border-radius: 4px 4px 0 0;
        display:       block;
        height:        15em;
      }

    }
  }

</style>
