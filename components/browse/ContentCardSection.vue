<template>
  <div
    v-if="section && section.fields"
    class="banner mb-5"
    data-qa="browse section"
  >
    <h2
      data-qa="section headline"
      class="col-6"
    >
      {{ section.fields.headline }}
    </h2>
    <p class="col-6">
      {{ section.fields.text }}
    </p>

    <b-card-group
      deck
      data-qa="section group"
    >
      <ContentCard
        v-for="card in section.fields.hasPart"
        :key="card.sys.id"
        :name="card.fields.name"
        :description="card.fields.description"
        :url="card.fields.url"
        :image-url="card.fields.image.fields.file.url"
        :image-title="card.fields.image.fields.title"
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
    }
  };
</script>

<style lang="scss" scoped>

@import "./assets/scss/variables.scss";

.banner {
  h2,
  p {
    padding: 0;
    text-align: left;
  }

  h2 {
    color: $darkgrey;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.12125rem;
  }

  p {
    color: $midgrey;
    letter-spacing: 0.0975rem;
  }
}

</style>
