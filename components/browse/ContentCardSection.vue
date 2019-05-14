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
        v-for="card in section.fields.hasPart"
        :key="card.sys.id"
        :name="card.fields.name"
        :description="card.fields.description"
        :creator="card.fields.creator"
        :institution="card.fields.institution"
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

.browse-section {
  h2,
  p {
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
    line-height: 1.5;
  }
}

</style>
